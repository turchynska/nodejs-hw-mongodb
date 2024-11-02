import { addContact, getAllContacts, getContactById, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            message: 'Successfully found contacts!',
            data: contacts,
        })
};


export const getContactIdController = async (req, res) => {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        if (!contact) {
            throw (createHttpError = (404, 'Contact not found!'));
        }
        res.status(200).json({
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
};

export const addContactController = async (req, res) => {
    const contact = await addContact(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    });
};


export const patchContactController = async (req, res) => {
    const { contactId } = req.params;

    const result = await updateContact(contactId, req.body);

    if (!result) {
        throw createHttpError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result.contact,
    })
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

 const contact = await deleteContact({ _id: contactId });

  if (!contact) {
      throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};