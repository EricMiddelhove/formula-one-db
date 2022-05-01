import { Router } from 'express';
import { errorHandler } from '../bin/errorHandler';
import { connection } from '../bin/www';
import { Driver, DriverCreateRequest } from '../models/driver';
import { DriverService } from '../services/driverService';

const router = Router();

router.get('/', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new DriverService(transactionalEntityManager);
    const results = await service.findAll();
    res.type('json').send(results.map(r => r.toResponseObject()));
  });
}));

router.get('/:id', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new DriverService(transactionalEntityManager);
    const result = await service.findOne(req.params.id);
    res.type('json').send(result.toResponseObject());
  });
}));

router.post('/', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new DriverService(transactionalEntityManager);
    const createRequest: DriverCreateRequest = req.body;
    Driver.validateCreateRequest(createRequest);
    const result = await service.insertOne(createRequest);
    res.type('json').send(result.toResponseObject());
  });
}));


export { router as driverRouter };
