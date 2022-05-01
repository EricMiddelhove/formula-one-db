import { connection } from '../bin/www';
import { EntityManager, Repository } from 'typeorm';
import { Constructor, ConstructorCreateRequest, ConstructorResponse } from '../models/constructor';
import { NotFound } from 'http-errors';

export class ConstructorService {
  private transactionalEntityManager: EntityManager;
  private repository: Repository<Constructor>;

  constructor(transactionalEntityManager: EntityManager) {
    this.transactionalEntityManager = transactionalEntityManager;
    this.repository = this.transactionalEntityManager.getRepository(Constructor);
  }

  async findOne(id: string): Promise<Constructor> {
    try {
      const result = await this.repository.findOne({
        where: { id },
        relations: {
          drivers: true,
          competedSeasons: true,
        },
      });
      return result;
    } catch (err) {
      throw new NotFound('Constructor does not exist');
    }
  }

  async findAll(): Promise<Constructor[]> {
    const result = await this.repository.find({
      relations: {
        drivers: true,
        competedSeasons: true,
      },
    });
    return result;
  }

  async insertOne(request: ConstructorCreateRequest): Promise<Constructor> {
    const constructor = new Constructor();

    constructor.name = request.name;
    constructor.championsshipPoints = request.championsshipPoints;
    constructor.drivers = [];
    constructor.competedSeasons = [];

    return this.repository.save(constructor);
  }


}