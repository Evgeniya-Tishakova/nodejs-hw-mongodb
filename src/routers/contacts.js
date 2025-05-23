import express from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

const router = express.Router();
const jsonParser = express.json();

router.get("/", ctrlWrapper(getContactsController));
router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post(
  "/",
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  "/:contactId",
  jsonParser,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController)
);

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default router;
