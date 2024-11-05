import e from 'express';
import {
  addContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactIdController = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found!',
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      data: null,
    });
  }
};

export const addContactController = async (req, res) => {
  const contact = await addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};
export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
      res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
    try {
        const { contactId } = req.params;

        const contact = await deleteContact({ _id: contactId });

        if (!contact) {
            return res.status(404).json({
                status: 404,
                message: "Contact not found",
                data: null,
            });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
