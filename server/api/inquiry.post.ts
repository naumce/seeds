import { z } from 'zod'
import { checkRateLimit } from '../utils/rateLimit'

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

/**
 * B2B enquiry endpoint. Validates, rate-limits and records the request.
 * Email delivery is wired in via `inquiryToEmail` once a provider is chosen;
 * for the MVP every valid enquiry is logged server-side so nothing is lost.
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
  const record = { ...inquiry, receivedAt: new Date().toISOString(), ip }

  console.info('[inquiry]', JSON.stringify(record))

  return { ok: true }
})
