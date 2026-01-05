// ⬇️ make sure env is loaded as soon as this module is imported
import 'dotenv/config';

import nodemailer from 'nodemailer';

function bool(v, def = false) {
  if (v === undefined || v === null || v === '') return def;
  const s = String(v).trim().toLowerCase();
  return ['1','true','yes','y','on'].includes(s) ? true :
         ['0','false','no','n','off'].includes(s) ? false : def;
}

/**
 * Supports:
 *  - Generic SMTP: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE
 *  - SES SMTP:     SES_SMTP_HOST, SES_SMTP_PORT, SES_SMTP_USER, SES_SMTP_PASS
 *    (or derive host from SES_REGION)
 */
const host =
  process.env.SMTP_HOST ||
  process.env.SES_SMTP_HOST ||
  (process.env.SES_REGION ? `email-smtp.${process.env.SES_REGION}.amazonaws.com` : undefined);

const port =
  Number(process.env.SMTP_PORT) ||
  Number(process.env.SES_SMTP_PORT) ||
  587;

const secure =
  bool(process.env.SMTP_SECURE, false) || port === 465; // TLS on 465, STARTTLS on 587

const user =
  process.env.SMTP_USER ||
  process.env.SES_SMTP_USER;

const pass =
  process.env.SMTP_PASS ||
  process.env.SES_SMTP_PASS;

if (!host) {
  throw new Error('Mailer not configured: set SMTP_HOST or SES_SMTP_HOST (or SES_REGION).');
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,           // true for 465, false for 587 (STARTTLS)
  auth: user && pass ? { user, pass } : undefined,
  requireTLS: !secure,                 // force STARTTLS on 587
  tls: { minVersion: 'TLSv1.2' },      // SES requires TLSv1.2+
});

export async function sendMail({ to, subject, html, text, replyTo }) {
  const from =
    process.env.MAIL_FROM ||          // prefer this if you already used it
    process.env.FROM_EMAIL ||         // your SES variable
    'no-reply@autonomyzambia.online';

  return transporter.sendMail({
    from, to, subject, html, text, replyTo,
  });
}
