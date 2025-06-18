import path from "node:path";
import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routers/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();

  app.use("/photos", express.static(path.resolve("src", "uploads", "photos")));
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use("/api-docs", swaggerDocs());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.use(router);

  app.use(errorHandler);
  app.use(notFoundHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
};
