import { NextFunction, Request, Response } from 'express';

type ExpressCallback = (req: Request, res: Response, next: NextFunction) => unknown;

export const errorHandler = (expressCallback: ExpressCallback) => (req: Request, res: Response, next: NextFunction): void => {
  Promise.resolve(expressCallback(req, res, next))
    .catch(err => {
      next(err);
    });
};