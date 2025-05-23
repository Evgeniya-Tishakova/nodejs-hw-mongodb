import Joi from "joi";

const stringField = Joi.string().min(3).max(20).messages({
  "string.base": "The field must be a string",
  "string.empty": "The field cannot be empty",
  "string.min": "Username should have at least {#limit} characters",
  "string.max": "Username should have at most {#limit} characters",
});

const emailField = Joi.string().email().min(3).max(20).messages({
  "string.email": "Invalid email format",
  "string.min": "Email must be at least {#limit} characters",
  "string.max": "Email must be at most {#limit} characters",
});

//! schema. POST

export const createContactSchema = Joi.object({
  name: stringField.required().messages({
    "any.required": "Username is required",
  }),
  phoneNumber: stringField.required().messages({
    "any.required": "The phoneNumber is required",
  }),
  email: emailField,
  isFavourite: Joi.boolean().messages({
    "boolean.base": 'The "isFavourite" field must be true or false',
  }),
  contactType: Joi.string()
    .valid("work", "home", "personal")
    .required()
    .messages({
      "any.only": 'The "contactType" must be one of: work, home, personal',
      "any.required": 'The "contactType" field is required',
    }),
});

//!PATCH

export const updateContactSchema = Joi.object({
  name: stringField,
  phoneNumber: stringField,
  email: emailField,
  isFavourite: Joi.boolean().messages({
    "boolean.base": 'The "isFavourite" field must be true or false',
  }),
  contactType: Joi.string().valid("work", "home", "personal").messages({
    "any.only": 'The "contactType" must be one of: work, home, personal',
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
