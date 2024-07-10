import Joi, { ValidationResult } from 'joi';
import BaseValidator from '.';
import { Request } from 'express';
import { Validator } from 'sequelize';
import { title } from 'process';

class PostValidator extends BaseValidator {
  constructor() {
    super();
  }

  public create = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      title: Joi.string().required().label('Title'),
      body: Joi.string().required().label('Body'),
      images: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required().label('Image Name'),
            url: Joi.string().uri().required().label('Image URL'),
          }),
        )
        .required()
        .label('Images'),
    });

    return this.validate(schema, req.body);
  };

  public update = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      title: Joi.string().label('Title'),
      body: Joi.string().label('Body'),
    });

    return this.validate(schema, req.body);
  };
}

export default new PostValidator();
