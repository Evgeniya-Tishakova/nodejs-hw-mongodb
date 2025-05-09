import express from "express";
import pino from "pino-http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.)

export const setupServer = () => {
  const app = express();
  app.use(express.json);
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );



  app.use((err, req, res) => {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  });

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
};
