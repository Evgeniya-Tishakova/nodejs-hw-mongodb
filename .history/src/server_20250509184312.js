import express from "express";
import pino from "pino-http";

export const setupServer = () => {
  const app = express();

  const PORT = 3000;

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
