import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const database = process.env.DATABASE;
export function makeDbConnection() {
  mongoose
    .connect(database)
    .then(() => {
      console.log("database connected");
    })
    .catch((error) => {
      console.error(error);
    });
}
