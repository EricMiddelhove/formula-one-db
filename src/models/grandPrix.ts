import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { DriverLink, DriverToGrandPrix } from './driverToGrandPrix';
import { Season } from './season';
import { BadRequest } from 'http-errors';

export interface GrandPrixResponse {
  id: string,
  name: string,
  year: number,
  circuit: string,
  seasonId: string,
  drivers: DriverLink[],
}

export interface GrandPrixCreateRequest {
  name: string,
  year: number,
  circuit: string,
  seasonId: string
}


@Entity()
export class GrandPrix extends BaseEntity {

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  circuit: string;

  @ManyToOne(() => Season, (season) => season.grandsprix)
  season: Season;

  @OneToMany(() => DriverToGrandPrix, (driverToGrandPrix) => driverToGrandPrix.grandPrix)
  driverToGrandPrix: DriverToGrandPrix[];

  toResponseObject(): GrandPrixResponse {
    return {
      id: this.id,
      name: this.name,
      year: this.year,
      circuit: this.circuit,
      seasonId: this.season.id,
      drivers: (this.driverToGrandPrix ?? []).map(dtG => dtG.toDriverLink()),
    };
  }

  static validateCreateRequest(createRequest: GrandPrixCreateRequest): void {
    if (!createRequest.name) {
      throw new BadRequest('Name must not be null or empty');
    }
    if (!createRequest.year) {
      throw new BadRequest('Year must not be null or empty');
    }
    if (!createRequest.circuit) {
      throw new BadRequest('Circuit must not be null or empty');
    }
    if (!createRequest.seasonId) {
      throw new BadRequest('Season Id must not be null or empty');
    }
    return;
  }
}