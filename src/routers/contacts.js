import { Router } from "express";
import * as contactControllers from '../controllers/contacts.js'
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from '../middlewares/authenticate.js';
import { createContactsSchema, patchContactSchema } from "../validation/contacts.js";
import { upload } from '../middlewares/multer.js';


const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get('/:contactId', isValidId,  ctrlWrapper(contactControllers.getContactIdController));

contactsRouter.post('/', upload.single('photo'), validateBody(createContactsSchema), ctrlWrapper(contactControllers.addContactController));

contactsRouter.patch('/:contactId', upload.single('photo'), validateBody(patchContactSchema), isValidId, ctrlWrapper(contactControllers.patchContactController));

contactsRouter.delete('/:contactId',isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;