import { EntityManager, Not, Repository } from 'typeorm';
import { GrandPrix, GrandPrixCreateRequest } from '../models/grandPrix';
import { SeasonService } from './seasonService';
import { NotFound } from 'http-errors';
import { DriverLinkRequest, DriverToGrandPrix } from '../models/driverToGrandPrix';
import { DriverService } from './driverService';

export class GrandPrixService {
  private transactionalEntityManager: EntityManager;
  private repository: Repository<GrandPrix>;
  private seasonService: SeasonService;
  private driverService: DriverService;

  constructor(transactionalEntityManager: EntityManager) {
    this.transactionalEntityManager = transactionalEntityManager;
    this.repository = this.transactionalEntityManager.getRepository(GrandPrix);
    this.seasonService = new SeasonService(transactionalEntityManager);
    this.driverService = new DriverService(transactionalEntityManager);
  }

  async findOne(id: string): Promise<GrandPrix> {
    try {
      const result = await this.repository.findOne({
        where: { id },
        relations: {
          season: true,
          driverToGrandPrix: true,
        },
      });
      return result;
    } catch (error) {
      throw new NotFound('Grand Prix does not exist');
    }
  }

  async findAll(): Promise<GrandPrix[]> {
    const result = await this.repository.find({
      relations: {
        season: true,
        driverToGrandPrix: true,
      },
    });
    return result;
  }

  async insertOne(request: GrandPrixCreateRequest): Promise<GrandPrix> {
    const gp = new GrandPrix();

    gp.name = request.name;
    gp.year = request.year;
    gp.circuit = request.circuit;
    gp.season = await this.seasonService.findOne(request.seasonId);

    return this.repository.save(gp);
  }


  async linkDrivers(id: string, driverLinkRequest: DriverLinkRequest): Promise<GrandPrix> {
    const gp = await this.findOne(id);

    for (const driverLink of driverLinkRequest.drivers) {
      const link = new DriverToGrandPrix();
      const driver = await this.driverService.findOne(driverLink.id);
      link.driver = driver;
      link.grandPrix = gp;
      link.placement = driverLink.placement;

      const createdLink = await this.transactionalEntityManager.getRepository(DriverToGrandPrix).save(link);
      gp.driverToGrandPrix.push(createdLink);
    }

    return gp;
  }

}