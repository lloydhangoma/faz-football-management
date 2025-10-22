import { sendMail } from '../config/mailer.js';

const APP_NAME = process.env.APP_NAME || 'Football Association of Zambia';
const SIGNUP_URL = process.env.APP_PORTAL_SIGNUP_URL || process.env.FRONTEND_URL || 'https://portal.example.com/signup';

function wrap(subject, body) {
  const html = `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;color:#0f172a">
    <div style="max-width:560px;margin:24px auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px">
      <h2 style="margin:0 0 8px 0;color:#0b6bdc">${APP_NAME}</h2>
      ${body}
      <p style="margin-top:24px;font-size:12px;color:#64748b">This is an automated message. Please do not reply.</p>
    </div>
  </div>`;
  const text = subject;
  return { html, text };
}

function buildFor(status, { clubName, contactName, contactEmail }, notes = '') {
  if (status === 'approved') {
    const subject = `Your club application has been approved`;
    const body = `
      <p>Hi ${contactName || 'there'},</p>
      <p>Your application for <strong>${clubName}</strong> has been <strong>approved</strong>.</p>
      <p>Please set up your account here:</p>
      <p><a href="${SIGNUP_URL}" style="color:#0b6bdc">${SIGNUP_URL}</a></p>
      ${notes ? `<p><em>Note:</em> ${notes}</p>` : ''}
    `;
    return { subject, ...wrap(subject, body) };
  }
  if (status === 'rejected') {
    const subject = `Your club application has been rejected`;
    const body = `
      <p>Hi ${contactName || 'there'},</p>
      <p>The application for <strong>${clubName}</strong> was <strong>rejected</strong>.</p>
      ${notes ? `<p><em>Reason:</em> ${notes}</p>` : ''}
      <p>You may re-apply after addressing the issues noted.</p>
    `;
    return { subject, ...wrap(subject, body) };
  }
  if (status === 'pending-docs') {
    const subject = `Additional documents required for your club application`;
    const body = `
      <p>Hi ${contactName || 'there'},</p>
      <p>Your application for <strong>${clubName}</strong> requires additional documentation.</p>
      ${notes ? `<p><em>Requested documents:</em> ${notes}</p>` : ''}
      <p>Please upload the required files at your earliest convenience.</p>
    `;
    return { subject, ...wrap(subject, body) };
  }
  const subject = `Your club application is under review`;
  const body = `
    <p>Hi ${contactName || 'there'},</p>
    <p>Your application for <strong>${clubName}</strong> is currently <strong>under review</strong>.</p>
    ${notes ? `<p>${notes}</p>` : ''}
    <p>We will notify you once the review is complete.</p>
  `;
  return { subject, ...wrap(subject, body) };
}

export async function sendClubAppStatusEmail(doc, status, notes) {
  const { subject, html, text } = buildFor(status, doc, notes);
  const to = doc.contactEmail;
  if (!to) return;
  try {
    await sendMail({ to, subject, html, text });
  } catch (e) {
    console.error('Email send failed:', e);
  }
}
