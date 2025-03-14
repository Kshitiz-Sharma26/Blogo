import { Router } from "express";
import {
  renderSignIn,
  renderSignUp,
  signUpHandler,
  signInHandler,
  logoutHandler,
  renderHomePage,
} from "../controllers/user.js";
import {
  publicRouteAuthCheck,
  getUserInfo,
} from "../middlewares/authorization.js";
const router = Router();

router.get("/", getUserInfo, renderHomePage);

router
  .route("/signup")
  .post(signUpHandler)
  .get(publicRouteAuthCheck, renderSignUp);
router
  .route("/signin")
  .post(signInHandler)
  .get(publicRouteAuthCheck, renderSignIn);

router.route("/logout").get(logoutHandler);

export default router;
