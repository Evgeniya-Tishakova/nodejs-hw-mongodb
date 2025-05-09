import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

export const initMongoConnection = (async) => {
  try {
    const user = getEnvVar();
  } catch (error) {
    console.log("Error while setting up mongo connection", error);
    throw error;
  }
};
