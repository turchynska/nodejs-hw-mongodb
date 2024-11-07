import { ContactsCollection } from "../db/models/contacts.js";



export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = ContactsCollection.find();

  if (typeof filter.type !== 'undefined') {
    contactQuery.where('contactType').equals(filter.type);
  }

  if (typeof filter.isFavorite !== 'undefined') {
    contactQuery.where('isFavourite').equals(filter.isFavorite);
  }

  const [total, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    page: page,
    perPage: perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
};



export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
};



export const addContact = async(payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
}




export const updateContact = async (contactId, contact) => {
    return ContactsCollection.findByIdAndUpdate(contactId, contact, { new: true });
};



export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete({
    _id: contactId,
  });

  return contact;
};