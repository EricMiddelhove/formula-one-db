import { EntityManager, Repository } from 'typeorm';
import { Season, SeasonCreateRequest } from '../models/season';
import { ConstructorService } from './constructorService';
import { NotFound } from 'http-errors';


export class SeasonService {
  private transactionalEntityManager: EntityManager;
  private repository: Repository<Season>;
  private constructorService: ConstructorService;

  constructor(transactionalEntityManager: EntityManager) {
    this.transactionalEntityManager = transactionalEntityManager;
    this.repository = this.transactionalEntityManager.getRepository(Season);
    this.constructorService = new ConstructorService(transactionalEntityManager);
  }

  async findOne(id: string): Promise<Season> {
    try {
      const result = await this.repository.findOne({
        where: { id },
        relations: {
          carConstructors: true,
          grandsprix: true,
        },
      });
      return result;
    } catch (error) {
      throw new NotFound('Season does not exist');
    }
  }

  async findAll(): Promise<Season[]> {
    const result = await this.repository.find({
      relations: {
        carConstructors: true,
        grandsprix: true,
      },
    });
    return result;
  }

  async insertOne(request: SeasonCreateRequest): Promise<Season> {
    const season = new Season();

    season.year = request.year;
    season.carConstructors = await Promise.all(request.carConstructorIds.map(async (constructorId) => this.constructorService.findOne(constructorId)));
    season.grandsprix = [];

    return this.repository.save(season);
  }


}