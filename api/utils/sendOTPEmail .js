"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_const_1 = require("../constants/env.const");
const sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: env_const_1.EMAIL,
            pass: env_const_1.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: env_const_1.EMAIL,
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
    yield transporter.sendMail(mailOptions);
});
exports.sendOTPEmail = sendOTPEmail;
//# sourceMappingURL=sendOTPEmail%20.js.map