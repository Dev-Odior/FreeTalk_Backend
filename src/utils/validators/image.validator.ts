import Joi, { ValidationResult } from 'joi';
import BaseValidator from '.';
import { Request } from 'express';

class ImageValidator extends BaseValidator {
  constructor() {
    super();
  }

  public update = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      name: Joi.string().label('Name'),
      url: Joi.string().uri().label('Image URL'),
    });

    return this.validate(schema, req.body);
  };
}

export default new ImageValidator();
