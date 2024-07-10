import Joi, { ValidationResult } from 'joi';
import BaseValidator from '.';
import { Request } from 'express';

class AuthValidatorUtil extends BaseValidator {
  constructor() {
    super();
  }

  public signUp = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      firstName: Joi.string().required().label('Firstname'),
      lastName: Joi.string().required().label('Lastname'),
      email: Joi.string().email().required().label('Email'),
      password: Joi.string()
        .required()
        .regex(this.patterns.password)
        .min(8)
        .label('Password')
        .messages({
          'string.pattern.base':
            'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
        }),
    });

    return this.validate(schema, req.body);
  };

  public login = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      email: Joi.string().email().required().label('Email'),
      password: Joi.string().required().label('Password'),
    });

    return this.validate(schema, req.body);
  };

  public forgotPassword = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      email: Joi.string().required().email().label('email'),
    });

    return this.validate(schema, req.body);
  };

  public resetPassword = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      password: Joi.string()
        .regex(this.patterns.password)
        .required()
        .min(8)
        .label('Password')
        .messages({
          'string.pattern.base':
            'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
        }),

      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .label('ConfirmPassword')
        .messages({ 'any.only': 'Passwords do not match.' }),
    });

    return this.validate(schema, req.body);
  };

  public changePassword = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      currentPassword: Joi.string().required().label('currentPassword'),

      newPassword: Joi.string()
        .required()
        .min(8)
        .label('NewPassword')
        .regex(this.patterns.password)
        .messages({
          'string.pattern.base':
            'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
        }),

      confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .label('ConfirmNewPassword')
        .messages({
          'any.only': 'Passwords do not match.',
        }),
    });

    return this.validate(schema, req.body);
  };
}

export default new AuthValidatorUtil();
