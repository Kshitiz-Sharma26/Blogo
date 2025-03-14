// using esm (type : module)
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import { makeDbConnection } from "./dbConnection.js";
import cookieParser from "cookie-parser";
import { configureCloudinary } from "./utility/cloudinary.js";
import blogRouter from "./routes/blog.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

// Set EJS as templating engine
// By default looks for views folder in directory
app.set("view engine", "ejs");

// Make connection with the database
makeDbConnection();

configureCloudinary();

// This middleware will parse browser cookies and parse req.cookies with them
app.use(cookieParser());

// This middleware will parse the form data and add it to the request's body
app.use(urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/blog", blogRouter);

// listening to requests
app.listen(port, () => {
  console.log("listening at port ", port);
});
