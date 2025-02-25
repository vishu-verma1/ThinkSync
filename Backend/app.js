import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connect from "./db/db.js";

connect();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello");
});

export default app;
