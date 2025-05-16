import mongoose from "mongoose";

function connect() {
  console.log("Connecting to MongoDB at:", process.env.MONGO_URI); // Debug log
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err); // Improved error logging
    });
}

export default connect;