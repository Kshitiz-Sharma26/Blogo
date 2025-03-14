import express from "express";
import {
  renderAddBlog,
  addBlogHandler,
  readBlogHandler,
  addCommentHandler,
} from "../controllers/blog.js";
import upload from "../utility/fileUpload.js";
import {
  getUserInfo,
  privateRouteAuthCheck,
} from "../middlewares/authorization.js";
const router = express.Router();

router
  .route("/addblog")
  .get(privateRouteAuthCheck, renderAddBlog)
  .post(privateRouteAuthCheck, upload.single("coverImage"), addBlogHandler);

router.route("/readblog/:id").get(getUserInfo, readBlogHandler);

router
  .route("/addcomment/:blogId")
  .post(privateRouteAuthCheck, addCommentHandler);

export default router;
