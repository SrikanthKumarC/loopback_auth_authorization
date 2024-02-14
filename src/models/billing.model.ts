import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Payment} from './payment.model';

@model()
export class Billing extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  units: number;

  @property({
    type: 'number',
    defaultValue: 0,
    required: false,
  })
  cost: number;

  // get cost(): number {
  @belongsTo(() => Payment)
  paymentId: string;
  //   return getCost(this.units);
  // }

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Billing>) {
    super(data);
  }
}

export interface BillingRelations {
  // describe navigational properties here
}

export type BillingWithRelations = Billing & BillingRelations;


export type PartialBilling = Billing & {
  password: string
}
