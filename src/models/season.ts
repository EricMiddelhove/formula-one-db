import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Constructor } from './constructor';
import { GrandPrix } from './grandPrix';
import { BadRequest } from 'http-errors';

export interface SeasonResponse {
  id: string,
  year: number,
  carConstructorIds: string[],
  grandsPrixIds: string[],

}

export interface SeasonCreateRequest {
  year: number,
  carConstructorIds: string[],
}

@Entity()
export class Season extends BaseEntity {

  @Column()
  year: number;

  @ManyToMany(() => Constructor, (carConstructor) => carConstructor.competedSeasons)
  carConstructors: Constructor[];

  @OneToMany(() => GrandPrix, (gp) => gp.season)
  grandsprix: GrandPrix[];

  toResponseObject(): SeasonResponse {
    return {
      id: this.id,
      year: this.year,
      carConstructorIds: this.carConstructors.map(constructor => constructor.id) ?? [],
      grandsPrixIds: this.grandsprix.map(gps => gps.id) ?? [],
    };
  }

  static validateCreateRequest(createRequest: SeasonCreateRequest): void {
    if (!createRequest.year) {
      throw new BadRequest('year must not be null or empty');
    }
    if (!createRequest.carConstructorIds) {
      throw new BadRequest('carConstructorIds must not be null or empty');
    }
    return;
  }

}