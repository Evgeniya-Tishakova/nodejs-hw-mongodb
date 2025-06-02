import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
} from "../controllers/auth.js";
import { registerSchema, loginSchema } from "../validation/auth.js";
import { validateBody } from "../middlewares/validateBody.js";

const router = express.Router();
const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerUserController)
);

router.post(
  "/login",
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginUserController)
);

router.post("/logout", ctrlWrapper(logoutUserController));

router.post("/refresh", ctrlWrapper(refreshUserController));

export default router;
