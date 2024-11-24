import createHttpError from 'http-errors';
import mongoose from 'mongoose';


import {
  addContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { ENABLE_CLOUDINARY } from '../constants/index.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';



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
  let photoUrl = null;
  if (req.file) {
    photoUrl = await uploadToCloudinary(req.file);
  }
  const data = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    contactType: req.body.contactType,
    userId: req.user.id,
    photo: photoUrl,
  }

  const contact = await addContact(data);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user?._id;
    const photo = req.file;

    console.log('Contact ID:', contactId);
    console.log('User ID:', userId);
    console.log('Request Body:', req.body);

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next(createHttpError(400, 'Invalid contact ID format'));
    }

    let photoUrl;
    if (photo) {
      if (env(ENABLE_CLOUDINARY) === 'true') {
        photoUrl = await uploadToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const updatedContact = await updateContact(
      contactId,
      { ...req.body, photo: photoUrl },
      userId,
    );

    if (!updatedContact) {
      return next(createHttpError(404, 'Contact not found or user mismatch'));
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
