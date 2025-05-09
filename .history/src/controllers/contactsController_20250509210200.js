import { getAllContacts } from "../services/contacts.js";

export const getContactsController = async () => {
  try {
    const contacts = await getAllContacts();
  } catch (error) {}
};
