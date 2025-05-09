import { getAllContacts, getContactById } from "../services/contacts.js";

export const getContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: "Successfully found contact with id ${contactId}!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  console.log(contact);

  if (!contact) {
    res.status(404).json({
      message: "Contact not found",
    });
    return;
  }
  res.status(200).json({
    status: 200,
    message: "Successfully found contact with id ${contactId}!",
    data: contact,
  });
};
