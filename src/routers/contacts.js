import { Router } from "express";
import * as contactControllers from '../controllers/contacts.js'
import ctrlWrapper from "../utils/ctrlWrapper.js";



const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(contactControllers.getContactIdController));

contactsRouter.post('/', ctrlWrapper(contactControllers.addContactController));

contactsRouter.patch('/:contactId', ctrlWrapper(contactControllers.patchContactController));

contactsRouter.delete('/:contactId', ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;