import Redis from "ioredis";

const redisClient = new Redis({
  port: process.env.REDIS_PORT, // Redis port
  host: process.env.REDIS_HOST, // Redis host
  password: process.env.REDIS_PASSWORD,
  db: 0,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

export default redisClient;