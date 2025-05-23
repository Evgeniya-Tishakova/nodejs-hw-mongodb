import createHttpError from "http-errors";

export const validateBody = (Schema) => async (req, res, next) => {
  try {
    await Schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const error = err.details.map((detail) => detail.message);
    next(createHttpError.BadRequest(error));
  }
};
