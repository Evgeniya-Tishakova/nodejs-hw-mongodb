import { getAllContacts } from "../services/contacts.js";

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res
    .status(200)
    .json({ data: contacts, message: "Successfully found contacts!" });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
};
