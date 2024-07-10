import Joi, { ValidationOptions } from 'joi';

export default class BaseValidator {
  private validationOption: ValidationOptions = {
    errors: {
      wrap: {
        label: '',
      },
    },
    abortEarly: false,
  };

  protected patterns = {
    phoneNumber: /^\+(?:[0-9] ?){6,14}[0-9]$/,
    '24HTime': /^([01]\d|2[0-3]):([0-5]\d)$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/,
  };

  protected validate(schema: Joi.AnySchema, payload: unknown) {
    return schema.validate(payload, this.validationOption);
  }
}
