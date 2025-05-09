import express from "express";

export const setupServer = () => {
  const app = express();

  const PORT = app.listen();
};
