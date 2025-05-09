import { getAllContacts, getContactById } from "../services/contacts.js";

export const getContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res
    .status(200)
    .json({ data: contacts, message: "Successfully found contacts!" });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById();
  console.log(contact);

  if (!contact) {
    res.status(404).json({
      message: "Contact not found",
    });
    return;
  }
  res.status(200).json({
    data: contact,
  });
};
