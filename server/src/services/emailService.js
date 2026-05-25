import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transport = getTransporter();
  if (!transport) {
    console.log(`[Email mock] To: ${to} | Subject: ${subject}`);
    return { mocked: true };
  }

  return transport.sendMail({
    from: process.env.EMAIL_FROM || 'OfficeBite <noreply@officebite.com>',
    to,
    subject,
    html,
    text,
  });
};

export const sendOrderNotification = async (user, order, event) => {
  const subjects = {
    confirmed: 'Order Confirmed!',
    preparing: 'Your food is being prepared',
    dispatched: 'Your order is on the way',
    delivered: 'Order Delivered - Enjoy!',
    payment_success: 'Payment Successful',
  };

  const subject = subjects[event] || `Order Update - ${order.receiptNumber}`;
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#f97316;">OfficeBite</h2>
      <p>Hi ${user.name},</p>
      <p>Your order <strong>${order.receiptNumber}</strong> status: <strong>${event.replace('_', ' ')}</strong></p>
      <p>Total: $${order.total?.toFixed(2)}</p>
      <p>Track your order in the app.</p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};
