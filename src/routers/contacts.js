import { Router } from "express";
import * as contactControllers from '../controllers/contacts.js'
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactsSchema } from "../validation/contacts.js";


const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get('/:contactId', isValidId,  ctrlWrapper(contactControllers.getContactIdController));

contactsRouter.post('/', validateBody(createContactsSchema), ctrlWrapper(contactControllers.addContactController));

contactsRouter.patch('/:contactId',validateBody(createContactsSchema), isValidId, ctrlWrapper(contactControllers.patchContactController));

contactsRouter.delete('/:contactId',isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;