import nodemailer from 'nodemailer'

export async function sendEmailService({
  to,
  subject,
  message,
  attachments = [],
} = {}) {
  // configurations
  const transporter = nodemailer.createTransport({
    host: 'localhost', // stmp.gmail.com
    port: 587, // 587 , 465
    secure: false, // false , true
    service: 'gmail', // optional
    auth: {
      // credentials
      user: 'eslamhussin600@gmail.com',
      pass: 'rkew ivbu xytk cvng',
    },
  })

  const emailInfo = await transporter.sendMail({
    from: '"3amo samy 👻" <eslamhussin600@gmail.com>',
    to: to ? to : '',
    subject: subject ? subject : 'Hello',
    html: message ? message : '',
    attachments,
  })
  if (emailInfo.accepted.length) {
    return true
  }
  return false
}





// Generate a random 5-digit code
export const sendVerificationEmail = async (toEmail, verificationCode) => {

  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Tasis Al Bina" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Email Verification Code',
    text: `Your verification code is: ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);
};

