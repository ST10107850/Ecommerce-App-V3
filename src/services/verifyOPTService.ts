import { BAD_REQUEST, NOT_FOUND } from "../constants/http.codes";
import Users from "../models/userModel";
import { generateOTP } from "../utils/generateOTP";
import HttpError from "../utils/HttpError";
import { sendOTPEmail } from "../utils/sendOTPEmail ";


export const verifyOPTService = async (email: string, otp: string) => {
  const user = await Users.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  if (!user.otpExpires || user.otpExpires < new Date()) {
    const newOTP = generateOTP(); 
    user.otp = newOTP;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
    await user.save();

    await sendOTPEmail(user.email, newOTP); 

    throw new HttpError(
      "OTP expired. A new OTP has been sent to your email.",
      BAD_REQUEST
    );
  }
 
  if (user.otp !== otp) {
    throw new HttpError("Invalid OTP", BAD_REQUEST);
  }

 
  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;

  await user.save();

  return user;
};
