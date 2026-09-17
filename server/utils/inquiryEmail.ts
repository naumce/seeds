import products from '../../content/products.json'
import type { Inquiry } from '../api/inquiry.post'

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)

const productName = (slug: string, locale: 'en' | 'mk') =>
  products.find((p) => p.slug === slug)?.name[locale] ?? slug

const ACK = {
  en: {
    subject: 'We received your request — Terra Spice',
    body: (name: string) =>
      `Dear ${name},\n\nThank you for your enquiry. We will reply within one working day with availability, specifications and pricing.\n\nTerra Spice\nNorth Macedonia · Worldwide`,
  },
  mk: {
    subject: 'Го примивме вашето барање — Terra Spice',
    body: (name: string) =>
      `Почитуван/а ${name},\n\nВи благодариме за барањето. Ќе одговориме во рок од еден работен ден со достапност, спецификации и цени.\n\nTerra Spice\nСеверна Македонија · Свет`,
  },
} as const

/** Plain, readable emails: one to the sales inbox, one acknowledgement to the sender. */
export const renderInquiryEmail = (q: Inquiry, receivedAt: string) => {
  const product = q.product ? productName(q.product, 'en') : '—'
  const rows: Array<[string, string]> = [
    ['Company', q.company],
    ['Name', q.name],
    ['Email', q.email],
    ['Phone', q.phone || '—'],
    ['Product', product],
    ['Quantity', q.quantity || '—'],
    ['Language', q.locale.toUpperCase()],
    ['Received', receivedAt],
  ]

  const internalText = [...rows.map(([k, v]) => `${k}: ${v}`), '', 'Message:', q.message || '—'].join('\n')
  const internalHtml = `<div style="font:15px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#292c28">
<h2 style="font-weight:500;margin:0 0 16px">New quote request</h2>
<table style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#5c6157">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`,
    )
    .join('')}</table>
<p style="margin:20px 0 6px;color:#5c6157">Message</p>
<p style="white-space:pre-wrap;margin:0">${esc(q.message || '—')}</p>
</div>`

  const ack = ACK[q.locale]
  const ackText = ack.body(q.name)
  const ackHtml = `<div style="font:15px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#292c28;white-space:pre-wrap">${esc(ackText)}</div>`

  return {
    internalSubject: `Quote request — ${q.company} — ${product}`,
    internalText,
    internalHtml,
    ackSubject: ack.subject,
    ackText,
    ackHtml,
  }
}
