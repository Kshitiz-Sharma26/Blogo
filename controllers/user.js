import User from "../models/user.js";
import Blog from "../models/blog.js";
import bcrypt from "bcryptjs";
import { getToken } from "../utility/authorization.js";

export const signUpHandler = async (req, resp) => {
  const { username, password, profilePicUrl, role } = req.body;
  try {
    await User.create({
      username,
      password,
      profilePicUrl,
      role,
    });
    return resp.redirect("/user");
  } catch (error) {
    let message = "Error while creating user";
    if (error.code === 11000) message = "User already exists";
    return resp.render("signUp", { error: message });
  }
};

export const signInHandler = async (req, resp) => {
  const { password, username: reqUser } = req.body;
  try {
    const {
      username,
      role,
      _id,
      profilePicUrl,
      password: hash,
    } = await User.getUser(reqUser);
    const compare = await bcrypt.compare(password, hash);
    if (compare) {
      // sign jwt token and return it in cookie
      const token = getToken({ username, role, profilePicUrl, id: _id });
      resp.cookie("auth_token", token, {
        maxAge: 60 * 60 * 1000,
      });
      return resp.redirect("/user");
    }
    return resp.render("signIn", { error: "Incorrect password" });
  } catch (error) {
    console.log(error);
    return resp.render("signIn", { error: error.message });
  }
};

export const renderSignUp = (req, resp) => {
  resp.render("signUp", { error: "" });
};

export const renderSignIn = (req, resp) => {
  resp.render("signIn", { error: "" });
};

export const logoutHandler = (req, resp) => {
  resp.clearCookie("auth_token");
  return resp.redirect("/user/signin");
};

export const renderHomePage = async (req, resp) => {
  const user = req.user;
  let blogs = [];
  try {
    blogs = await Blog.find({});
    console.log(blogs);
  } catch (error) {
  } finally {
    return resp.render("home", { user: user ?? {}, blogs });
  }
};
