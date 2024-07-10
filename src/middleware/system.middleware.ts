import serverConfig from '@src/configs/server.config';
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { RequestValidator } from '@src/interface/functions.interface';

import Joi from 'joi';
import SystemError from '@src/errors/system.error';

class SystemMiddleware {
  public errorHandler(): ErrorRequestHandler {
    return (error, req: Request, res: Response, next: NextFunction) => {
      const isProduction = serverConfig.NODE_SERVER_ENVIRONMENT === 'production';

      const errorCode =
        error.code != null && Number(error.code) >= 100 && Number(error.code) <= 599
          ? error.code
          : 500;

      let errorMessage: SystemError | object = {};

      if (res.headersSent) {
        next(error);
      }

      if (!isProduction) {
        serverConfig.DEBUG(error.stack);
        errorMessage = error;
      }

      if (serverConfig.NODE_SERVER_ENVIRONMENT === '') console.log(error);

      if (error instanceof Joi.ValidationError) {
        res.status(400).json({
          message: 'Validation error',
          error: error.details.map((detail) => detail.message),
        });
      }

      if (errorCode === 500 && isProduction) {
        res.status(500).json({
          message: 'An unexpected error occurred. Please try again later.',
        });
      }

      res.status(errorCode).json({
        message: error.message,
        error: {
          ...(error.errors && { error: error.errors }),
          ...(!isProduction && { trace: errorMessage }),
        },
      });
    };
  }

  public validateRequestBody(validator: RequestValidator) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = validator(req);
      if (error) throw error;
      req.body = value;
      next();
    };
  }

  public formatRequestQuery(req: Request, _res: Response, next: NextFunction) {
    try {
      const {
        query: { search, limit, offset },
      } = req;

      req.queryOpts = {
        limit: limit ? Number(limit) : 10,
        offset: offset ? Number(offset) : 0,
        search: search ? (search as string) : undefined,
      };

      next();
    } catch (error) {
      serverConfig.DEBUG(
        `Error occurred at system middleware format request query method::${error}`,
      );

      next(error);
    }
  }

  public formatRequestParamsId(param: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { paramsIds, params } = req;
        req.paramsIds = { ...paramsIds };
        req.paramsIds[`${param}`] = Number(params[param]);
        next();
      } catch (error) {
        serverConfig.DEBUG(
          `Error occurred at system middleware format request params id method: ${error}`,
        );
        next(error);
      }
    };
  }
}

export default new SystemMiddleware();
