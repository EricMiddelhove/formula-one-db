import createError from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'reflect-metadata';

import { indexRouter } from './routes/indexRoute';
import { driverRouter } from './routes/driverRoute';
import { grandPrixRouter } from './routes/grandPrixRoute';
import { seasonRouter } from './routes/seasonRoute';
import { constructorRouter } from './routes/constructorRoute';

/*
  EXPRESS SETUP
*/
const app = express();

// Various Express Middlewares
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

/**
 * ROUTING DEFINTIONS
 */
app.use('/', indexRouter);
app.use('/drivers', driverRouter);
app.use('/grandsPrix', grandPrixRouter);
app.use('/constructors', constructorRouter);
app.use('/seasons', seasonRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = err;

  err.status =
    err.status
      ? err.status
      : 500;

  // render the error page
  res.status(err.status).send({ status: err.status, message: err.message });
});

module.exports = app;