import { Router } from 'express';
import { errorHandler } from '../bin/errorHandler';

const router = Router();

router.get('/', errorHandler(async (req, res, next) => {
  res.send('Hello world');
}));


export { router as indexRouter };
