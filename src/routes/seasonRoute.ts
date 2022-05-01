import { Router } from 'express';
import { errorHandler } from '../bin/errorHandler';
import { connection } from '../bin/www';
import { Season, SeasonCreateRequest } from '../models/season';
import { SeasonService } from '../services/seasonService';

const router = Router();

router.get('/', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new SeasonService(transactionalEntityManager);
    const results = await service.findAll();
    res.type('json').send(results.map(r => r.toResponseObject()));
  });
}));

router.get('/:id', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new SeasonService(transactionalEntityManager);
    const result = await service.findOne(req.params.id);
    res.type('json').send(result.toResponseObject());
  });
}));

router.post('/', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new SeasonService(transactionalEntityManager);
    const createRequest: SeasonCreateRequest = req.body;
    Season.validateCreateRequest(createRequest);
    const result = await service.insertOne(createRequest);
    res.type('json').send(result.toResponseObject());
  });
}));

export { router as seasonRouter };
