import { Driver, DriverCreateRequest } from '../models/driver';
import { EntityManager, Repository } from 'typeorm';
import { ConstructorService } from './constructorService';
import { NotFound } from 'http-errors';

export class DriverService {
  private transactionalEntityManager: EntityManager;
  private driverRepository: Repository<Driver>;

  private constructorService: ConstructorService;

  constructor(transactionalEntityManager: EntityManager) {
    this.transactionalEntityManager = transactionalEntityManager;
    this.driverRepository = this.transactionalEntityManager.getRepository(Driver);
    this.constructorService = new ConstructorService(transactionalEntityManager);
  }

  async findAll(): Promise<Driver[]> {
    const results = await this.driverRepository.find(
      {
        relations: {
          carConstructor: true,
          driverToGrandPrix: true,
        },
      },
    );
    return results;
  }

  async findOne(id: string): Promise<Driver> {
    try {
      const result = await this.driverRepository.findOne(
        {
          where: { id },
          relations: {
            carConstructor: true,
            driverToGrandPrix: true,
          },
        },
      );
      return result;
    } catch (error) {
      throw new NotFound('Driver does not exist');
    }
  }

  async insertOne(request: DriverCreateRequest): Promise<Driver> {
    const driver = new Driver();

    driver.name = request.name;
    driver.abbreviation = request.abbreviation;
    driver.championsshipPoints = request.championsshipPoints;
    driver.carConstructor = await this.constructorService.findOne(request.carConstructorId);

    return await this.driverRepository.save(driver);
  }

}