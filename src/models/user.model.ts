import {Entity, model, property, hasMany} from '@loopback/repository';
import {Billing} from './billing.model';

@model({
  settings: {
    hiddenProperties: ['password'],
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    pattern: '^\\S+@\\S+\\.\\S+$',
    format: 'email',
    minLength: 6,
    maxLength: 127,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8,
      errorMessage: 'password must be greater than or equal to 8 characters',
    },
    hidden: true,
  })
  password: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['ADMIN', 'CLERK', 'CONSUMER'],
    },
    required: false,
    default: 'CONSUMER',
  })
  role: string;

  @hasMany(() => Billing)
  billings: Billing[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];
  
  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
