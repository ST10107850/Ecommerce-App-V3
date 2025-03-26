import mongoose, { Schema } from "mongoose";
import { User } from "../types/userTypes";
import bcrypt from "bcrypt";

const userSchema = new Schema<User>(
  {
    profileImage: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      unique: true,
      trim: true,
    },
    idNumber: {
      type: Number,
      unique: true,
      trim: true,
    },
    address: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        street: {
          type: String,
          required: true,
          trim: true,
        },
        town: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        postalCode: {
          type: Number,
          required: true,
          trim: true,
        },
      },
    ],
    role: {
      type: String,
      required: true,
      enum: ["admin", "customer"],
      default: "customer",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: { type: Boolean, required: true, default: false },
    otp: { type: String },
    otpExpires: { type: Date },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.omitFields = function (fields: string[]) {
  const user = this.toObject();
  const fieldsToOmit = Array.isArray(fields) ? fields : [fields];

  fieldsToOmit.forEach((field) => {
    delete user[field];
  });

  return user;
};

const Users = mongoose.model("Users", userSchema);

export default Users;
