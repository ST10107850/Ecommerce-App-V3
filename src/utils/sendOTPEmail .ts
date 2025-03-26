import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASS } from "../constants/env.const";

export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
            }
            .otp-code {
              font-size: 1.5em;
              font-weight: bold;
              color: #007BFF;
            }
            .footer {
              font-size: 0.9em;
              color: #777;
              margin-top: 20px;
            }
            .footer a {
              color: #007BFF;
            }
          </style>
        </head>
        <body>
          <p>Hello,</p>
          
          <p>We received a request to verify your account with a one-time password (OTP).</p>
          
          <p><span class="otp-code">Your OTP code is: ${otp}</span></p>
          
          <p>This code is valid for the next <strong>10 minutes</strong>. Please enter the code on the website to complete your verification.</p>

          <p>If you did not request this code, you can safely ignore this email.</p>

          <p class="footer">
            Thank you,<br>
            <strong>Exclusive</strong><br>
            The Exclusive Support Team<br>
            <a href="mailto:support@exclusive.com">support@exclusive.com</a>
          </p>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
