import nodemailer from 'nodemailer';

// create transporter once — reused for every email
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async ({ to, resetToken, username }) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject: 'Reset your Casino Demo password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6c5ce7;">Reset your password</h2>
        <p>Hi ${username},</p>
        <p>You requested a password reset for your Casino Demo account.</p>
        <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
        
          href="${resetUrl}"
          style="
            display: inline-block;
            background: #6c5ce7;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 16px 0;
          "
        >
          Reset password
        </a>
        <p style="color: #888; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
          Your password will not change.
        </p>
        <p style="color: #888; font-size: 12px;">
          Or copy this link: ${resetUrl}
        </p>
      </div>
    `,
  });
};