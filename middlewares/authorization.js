import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

export const privateRouteAuthCheck = (req, resp, next) => {
  const { auth_token } = req.cookies;

  if (!auth_token) return resp.redirect("/user/signin");

  try {
    const user = jwt.verify(auth_token, secret);
    req.user = user;
    next();
  } catch (error) {
    resp.redirect("/user/signin");
  }
};

export const publicRouteAuthCheck = (req, resp, next) => {
  const { auth_token } = req.cookies;

  if (!auth_token) {
    next();
  }
  try {
    const user = jwt.verify(auth_token, secret);
    req.user = user;
    resp.redirect("/user");
  } catch (error) {
    next();
  }
};

export const getUserInfo = (req, resp, next) => {
  const { auth_token } = req.cookies;
  if (!auth_token) return next();

  try {
    const user = jwt.verify(auth_token, secret);
    req.user = user;
  } catch (err) {}
  next();
};
