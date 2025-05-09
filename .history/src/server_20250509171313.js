import express from "express";

export const setupServer = () => {
  const app = express();

  const PORT = 3000;

  app.listen(PORT);
};
