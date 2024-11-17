import {
  addContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';


export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

 
  
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const contact = await addContact({...req.body, userId});

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};


export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

  const updatedContact = await updateContact(contactId, req.body, userId);

  if (!updatedContact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);

  if (contact === null) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
