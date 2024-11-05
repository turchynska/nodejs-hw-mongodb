import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
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