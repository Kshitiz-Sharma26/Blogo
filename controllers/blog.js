import fs from "fs";
import { uploadImageToCloudinary } from "../utility/cloudinary.js";
import Blog from "../models/blog.js";
import Comment from "../models/comments.js";

export const renderAddBlog = (req, resp) => {
  return resp.render("addBlog", { user: req.user, error: "" });
};

export const addBlogHandler = async (req, resp) => {
  const user = req.user;
  const { title, body } = req.body;
  let secure_url, filePath;
  try {
    // Image is optional to upload;
    if (req.file) {
      filePath = req.file.path;
      secure_url = await uploadImageToCloudinary(filePath);
      console.log(secure_url);
    }

    await Blog.create({
      title,
      body,
      coverImage: secure_url,
      createdBy: user.id,
    });

    if (filePath) fs.unlinkSync(filePath);
    return resp.redirect("/user");
  } catch (err) {
    console.log(err);
    resp.render("addBlog", {
      user: req.user,
      error: "Oops!! Could not upload your blog",
    });
  }
};

export const readBlogHandler = async (req, resp) => {
  const id = req.params.id;
  const user = req.user ?? {};
  let error = "",
    comments = [];
  let blog;

  try {
    blog = await Blog.findOne({ _id: id }).populate("createdBy");
    comments = await Comment.find({ blog: id }).populate("createdBy");
  } catch (err) {
    error = "Sorry, blog does not exists";
  } finally {
    resp.render("viewblog", {
      blog,
      user,
      error,
      comments,
    });
  }
};

export const addCommentHandler = async (req, resp) => {
  const { content } = req.body;
  const user = req.user,
    blogId = req.params.blogId;

  try {
    await Comment.create({
      content,
      createdBy: user.id,
      blog: blogId,
    });
  } catch (err) {
    console.log("error while adding comment");
  }
  return resp.redirect(`/blog/readblog/${blogId}`);
};
