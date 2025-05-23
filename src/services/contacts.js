import { contactsCollection } from "../db/models/contactModel.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = contactsCollection.find();

  if (typeof filter.contactType !== "undefined") {
    contactQuery.where("contactType").equals(filter.contactType);
  }

  if (typeof filter.isFavourite !== "undefined") {
    contactQuery.where("isFavourite").equals(filter.isFavourite);
  }

  const [contactCount, contacts] = await Promise.all([
    contactsCollection.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const paginationData = calculatePaginationData(contactCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contactById = await contactsCollection.findById(contactId);
  return contactById;
};

export const createContact = async (payload) => {
  const contact = await contactsCollection.create(payload);
  return contact;
};

export const patchContact = async (contactId, payload) => {
  const result = await contactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true, includeResultMetadata: true }
  );

  if (!result || !result.value) return null;

  return result.value;
};

export const deleteContact = async (contactId) => {
  const contact = await contactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
};
