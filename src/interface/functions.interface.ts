import { ValidationResult } from 'joi';
import { Request } from 'express';

export interface QueryOpts {
  limit: number;
  offset: number;
  search?: string;
}

export type RequestValidator = (req: Request) => ValidationResult;
