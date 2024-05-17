import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import "express-async-errors";
import { connectDB } from "./db/connect";
import { errorHandlerMiddleware } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
// security packages:

// import xss from "xss-clean";

// routers
import { authRouter } from "./routes/authRoutes";
import { userRouter } from "./routes/userRoutes";
import { productRouter } from "./routes/productRoutes";
import { reviewRouter } from "./routes/reviewRoutes";

import { authenticateUser } from "./middleware/full-auth";
import morgan from "morgan";
import { orderRouter } from "./routes/orderRoutes";

// allows access to env variables from .env file via process.env
config();

const app = express();

//env variables
const {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

//security packages middlware

// morgan logs a formatted http request line
app.use(morgan("tiny"));
// lets us be able to serve our default images
app.use(express.static("public"));
// put request date into body
app.use(express.json());
// parses cookies into req.signedCookies for incoming requests
app.use(cookieParser(JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", authenticateUser, orderRouter);

app.use(notFound);
// error handler must be last middlware by express rules
app.use(errorHandlerMiddleware);

const port = PORT || 5000;

// start up server and MongoDB connection
(async () => {
  try {
    await connectDB(MONGO_URI as string);
    console.log(`db is up and running...`);
    app.listen(port, () =>
      console.log(`Server is up and running on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
})();
