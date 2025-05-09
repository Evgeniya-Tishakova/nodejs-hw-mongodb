import express from "express";

export const setupServer = () => {
  const app = express();

  const PORT = 3000;

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
};
