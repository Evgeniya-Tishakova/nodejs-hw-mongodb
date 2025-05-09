import mongoose from "mongoose";

export const initMongoConnection = (async) => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;
  } catch (error) {
    console.log("Error while setting up mongo connection", error);
    throw error;
  }
};
