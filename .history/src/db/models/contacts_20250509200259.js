import { Schema } from "mongoose";

const contactsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age,
});
