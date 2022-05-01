import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Constructor, ConstructorResponse } from './constructor';
import { DriverToGrandPrix, GrandPrixLink } from './driverToGrandPrix';
import { GrandPrix, GrandPrixResponse } from './grandPrix';
import { BadRequest } from 'http-errors';

export interface DriverResponse {
  id: string,
  name: string,
  abbreviation: string,
  championsshipPoints: number,
  carConstructorId: string,
  grandsPrix: GrandPrixLink[],
}

export interface DriverCreateRequest {
  name: string,
  abbreviation: string,
  championsshipPoints: number,
  carConstructorId: string
}


@Entity()
export class Driver extends BaseEntity {

  @Column()
  name: string;

  @Column('varchar', { length: 3 })
  abbreviation: string;

  @Column()
  championsshipPoints: number;

  @ManyToOne(() => Constructor, (carConstructor) => carConstructor.drivers)
  carConstructor: Constructor;

  @OneToMany(() => DriverToGrandPrix, (driverToGrandPrix) => driverToGrandPrix.driver)
  driverToGrandPrix?: DriverToGrandPrix[];

  toResponseObject(): DriverResponse {
    return {
      id: this.id,
      name: this.name,
      abbreviation: this.abbreviation,
      championsshipPoints: this.championsshipPoints,
      carConstructorId: this.carConstructor.id,
      grandsPrix: (this.driverToGrandPrix ?? []).map(dtG => dtG.toGrandPrixLink()),
    };
  }

  static validateCreateRequest(createRequest: DriverCreateRequest): void {
    if (!createRequest.name) {
      throw new BadRequest('Name must not be null or empty');
    }
    if (!createRequest.abbreviation) {
      throw new BadRequest('Abbreviation must not be null or empty');
    }
    if (createRequest.abbreviation.length !== 3) {
      throw new BadRequest('Abbreviation must be 3 chars long');
    }
    if (!createRequest.championsshipPoints) {
      throw new BadRequest('Championsship Points must not be null or empty');
    }
    if (!createRequest.carConstructorId) {
      throw new BadRequest('Car Constructor Id must not be null or empty');
    }
    return;
  }
}
