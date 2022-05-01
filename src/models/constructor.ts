import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Driver, DriverResponse } from './driver';
import { Season } from './season';
import { BadRequest } from 'http-errors';


export interface ConstructorResponse {
  id: string,
  name: string,
  championsshipPoints: number,
  driverIds: string[],
  seasonIds: string[]
}

export interface ConstructorCreateRequest {
  name: string,
  championsshipPoints: number,
}

@Entity()
export class Constructor extends BaseEntity {

  @Column()
  name: string

  @Column()
  championsshipPoints: number

  @OneToMany(() => Driver, (driver) => driver.carConstructor)
  drivers: Driver[];

  @ManyToMany(() => Season, (season) => season.carConstructors)
  @JoinTable()
  competedSeasons: Season[];

  toResponseObject(): ConstructorResponse {
    return {
      id: this.id,
      name: this.name,
      championsshipPoints: this.championsshipPoints,
      driverIds: (this.drivers ?? []).map(d => d.id),
      seasonIds: (this.competedSeasons ?? []).map(s => s.id),
    };
  }

  static validateCreateRequest(createRequest: ConstructorCreateRequest): void {
    if (!createRequest.name) {
      throw new BadRequest('Name must not be null or empty');
    }
    if (createRequest.championsshipPoints === null || createRequest.championsshipPoints === undefined) {
      throw new BadRequest('Championsship Points must not be null or empty');
    }
    createRequest.championsshipPoints = Number(createRequest.championsshipPoints);
    return;
  }
}