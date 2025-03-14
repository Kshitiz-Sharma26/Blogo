import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      maxLength: 20,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicUrl: {
      type: String,
      default: process.env.PROFILE_PIC,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// This middleware runs before saving the document to convert password into a hash
userSchema.pre("save", async function (next) {
  // Hash password only when field password is modified, Mongoose can track if
  // the password field of document is explicitly modified,
  // e.g. user.password = "new password";
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

userSchema.statics.getUser = async function (username) {
  const user = await this.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const User = mongoose.model("user", userSchema);

export default User;
