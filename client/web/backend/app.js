import dotenv from "dotenv";
dotenv.config();
import express from "express";
import ConnectDb from "./dbConnect/connectDB.js";
import authRouter from "./routes/authRoute.js";
import thingRouter from "./routes/thingRoute.js";
import cookieParser from "cookie-parser";

import { createProxyMiddleware } from"http-proxy-middleware";

//Extra security
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";

// Import error handlers
import NotFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import authenticateUser from "./middlewares/authentication.js";

const proxy = createProxyMiddleware({
  target: "http://127.0.0.1:5002", // Replace with your backend API URL
  changeOrigin: true, // Change origin to match backend for cookie access
});

const app = express();

// Fetching Environmental variables
const url = process.env.MONGODB_URL;
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(express.json());
app.use(helmet());
app.use(xss());
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 2 * 60 * 1000, //  2 minutes
    max: 500, //  limit each IP to 500 requests per windowMs
  })
);

// Add cookieParser middleware with a secret string
app.use(cookieParser(process.env.JWT_SECRET));

// app.use("/api/user", authRouter, proxy);
app.use("/api/user", authRouter);
app.use("/api/thing", authenticateUser, thingRouter);

app.use(NotFound);
app.use(errorHandler);

const start = async () => {
  try {
    await ConnectDb(url);
    app.listen(port, () =>
      console.log(`server running at http://127.0.1:${port}/api`)
    );
  } catch (error) {
    console.log("Error occurred: ", error);
  }
};

start();
