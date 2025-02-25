import "dotenv/config";

import http from "http";
import app from "./app.js";

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`port is running on ${port} `);
});
