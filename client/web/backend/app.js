import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "./connect/connectDB";

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
    windowMs: 10 * 60 * 1000, //10 minutes
    max: 500, //limit each IP to 500 requests per windowMs
  })
);

const start = async () => {
  try {
    await connectDb(url);
    app.listen(port, () =>
      console.log(`server running at http://127.0.1:${port}/api`)
    );
  } catch (error) {
    console.log("Error occurred: ", error);
  }
};

start();
