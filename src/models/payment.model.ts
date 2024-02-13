import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Payment extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  billId: string;

  @property({
    type: 'boolean',
    required: false,
    default: false,
  })
  isPaid: boolean

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Payment>) {
    super(data);
  }
}

export interface PaymentRelations {
  // describe navigational properties here
}

export type PaymentWithRelations = Payment & PaymentRelations;
