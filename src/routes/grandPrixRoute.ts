import { Router } from 'express';
import { errorHandler } from '../bin/errorHandler';
import { connection } from '../bin/www';
import { DriverLinkRequest, DriverToGrandPrix } from '../models/driverToGrandPrix';
import { GrandPrix, GrandPrixCreateRequest } from '../models/grandPrix';
import { GrandPrixService } from '../services/grandPrixService';

const router = Router();

router.get('/', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new GrandPrixService(transactionalEntityManager);
    const results = await service.findAll();
    res.type('json').send(results.map(r => r.toResponseObject()));
  });
}));

router.get('/:id', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new GrandPrixService(transactionalEntityManager);
    const result = await service.findOne(req.params.id);
    res.type('json').send(result.toResponseObject());
  });
}));

router.post('/', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new GrandPrixService(transactionalEntityManager);
    const createRequest: GrandPrixCreateRequest = req.body;
    GrandPrix.validateCreateRequest(createRequest);
    const result = await service.insertOne(createRequest);
    res.type('json').send(result.toResponseObject());
  });
}));

router.post('/:id/drivers', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new GrandPrixService(transactionalEntityManager);
    const createRequest: DriverLinkRequest = req.body;
    DriverToGrandPrix.validateCreateRequest(createRequest);
    const result = await service.linkDrivers(req.params.id, createRequest);
    res.type('json').send(result.toResponseObject());
  });
}));
export { router as grandPrixRouter };
