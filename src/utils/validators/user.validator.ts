import Joi from 'joi';
import BaseValidator from '.';
import { Request } from 'express';

class UserValidator extends BaseValidator {
  constructor() {
    super();
  }

  public update(req: Request) {
    const schema = Joi.object().keys({
      lastName: Joi.string().label('Lastname'),
      firstName: Joi.string().label('Lastname'),
    });

    return this.validate(schema, req.body);
  }
}

export default new UserValidator();
