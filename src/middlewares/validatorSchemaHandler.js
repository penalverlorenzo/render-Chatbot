import { badRequest } from '@hapi/boom';

export const validatorSchemaHandler = (schema, property) => {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      next(badRequest(error));
    }
    next();
  }
}

