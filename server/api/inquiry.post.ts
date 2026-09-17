import { z } from 'zod'
import { Resend } from 'resend'
import { checkRateLimit } from '../utils/rateLimit'
import { renderInquiryEmail } from '../utils/inquiryEmail'

const InquirySchema = z.object({
  company: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(''),
  product: z.string().trim().max(80).optional().default(''),
  quantity: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
  locale: z.enum(['en', 'mk']).optional().default('en'),
  website: z.string().max(0).optional().default(''), // honeypot: must stay empty
})

export type Inquiry = Omit<z.infer<typeof InquirySchema>, 'website'>

/**
 * B2B enquiry endpoint: validate → rate-limit → email the sales inbox and
 * acknowledge the sender. Without RESEND_API_KEY it logs instead of sending,
 * so a misconfigured deploy still records the lead.
 */
export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!checkRateLimit(ip)) {
    throw createError({ statusCode: 429, message: 'Too many requests. Please try again later.' })
  }

  const parsed = InquirySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'Please check the required fields.' })
  }

  const { website, ...inquiry } = parsed.data
  const receivedAt = new Date().toISOString()
  const config = useRuntimeConfig(event)

  if (!config.resendApiKey || !config.inquiryToEmail) {
    console.info('[inquiry:unsent]', JSON.stringify({ ...inquiry, receivedAt, ip }))
    return { ok: true }
  }

  const resend = new Resend(config.resendApiKey)
  const mail = renderInquiryEmail(inquiry, receivedAt)

  try {
    await resend.emails.send({
      from: config.inquiryFromEmail,
      to: [config.inquiryToEmail],
      replyTo: inquiry.email,
      subject: mail.internalSubject,
      html: mail.internalHtml,
      text: mail.internalText,
    })
    await resend.emails.send({
      from: config.inquiryFromEmail,
      to: [inquiry.email],
      subject: mail.ackSubject,
      html: mail.ackHtml,
      text: mail.ackText,
    })
  } catch (error) {
    console.error('[inquiry:send-failed]', error, JSON.stringify({ ...inquiry, receivedAt }))
    throw createError({ statusCode: 502, message: 'We could not send your request. Please email us directly.' })
  }

  return { ok: true }
})
