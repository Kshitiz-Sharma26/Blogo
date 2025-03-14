import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fprofile-svg&psig=AOvVaw3BYscSg_JaP6epweAInM-W&ust=1741591237913000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCKjriL-7_IsDFQAAAAAdAAAAABAE",
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
