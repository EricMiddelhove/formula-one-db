import { Router } from 'express';
import { errorHandler } from '../bin/errorHandler';
import { connection } from '../bin/www';
import { Constructor, ConstructorCreateRequest } from '../models/constructor';
import { ConstructorService } from '../services/constructorService';

const router = Router();

router.get('/', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new ConstructorService(transactionalEntityManager);
    const results = await service.findAll();
    res.type('json').send(results.map(r => r.toResponseObject()));
  });
}));

router.get('/:id', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new ConstructorService(transactionalEntityManager);
    const result = await service.findOne(req.params.id);
    res.type('json').send(result.toResponseObject());
  });
}));

router.post('/', errorHandler(async (req, res, next) => {
  await connection.transaction(async (transactionalEntityManager) => {
    const service = new ConstructorService(transactionalEntityManager);
    const createRequest: ConstructorCreateRequest = req.body;
    Constructor.validateCreateRequest(createRequest);
    const result = await service.insertOne(createRequest);
    res.type('json').send(result.toResponseObject());
  });
}));


export { router as constructorRouter };
