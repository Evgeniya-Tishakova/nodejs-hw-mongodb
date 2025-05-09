import { contactsCollection } from "../db/models/contactModel.js";

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();
  return contacts;
};
