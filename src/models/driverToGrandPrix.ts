import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Driver } from './driver';
import { GrandPrix } from './grandPrix';
import { BadRequest } from 'http-errors';

export interface DriverLink {
  id: string,
  placement: number,
}

export interface GrandPrixLink {
  id: string,
  placement: number,
}

export interface DriverLinkRequest {
  drivers: DriverLink[],
}

@Entity()
export class DriverToGrandPrix {
  @PrimaryGeneratedColumn('uuid')
  private id: string;

  @Column()
  placement: number;

  @ManyToOne(() => Driver, (driver) => driver.driverToGrandPrix, { eager: true })
  driver: Driver;

  @ManyToOne(() => GrandPrix, (gp) => gp.driverToGrandPrix, { eager: true })
  grandPrix: GrandPrix;

  toDriverLink(): DriverLink {
    return {
      id: this.driver.id,
      placement: this.placement,
    };
  }

  toGrandPrixLink(): GrandPrixLink {
    return {
      id: this.grandPrix.id,
      placement: this.placement,
    };
  }

  static validateCreateRequest(request: DriverLinkRequest): void {
    if (!request.drivers) {
      throw new BadRequest('Drivers must not be null');
    }
    const seenDriverIds: string[] = [];

    for (const [i, driverLink] of request.drivers.entries()) {
      if (!driverLink.id) {
        throw new BadRequest(`Driver id must not be null or empty for driver ${i}.`);
      }
      if (!driverLink.placement) {
        throw new BadRequest(`Driver placement must not be null or empty for driver ${i}.`);
      }
      if (seenDriverIds.includes(driverLink.id)) {
        throw new BadRequest('Driver id must not be duplicated.');
      }
      seenDriverIds.push(driverLink.id);
    }
  }
}