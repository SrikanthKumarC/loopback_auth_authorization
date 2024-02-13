import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Billing,
} from '../models';
import {UserRepository} from '../repositories';

export class UserBillingController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/billings', {
    responses: {
      '200': {
        description: 'Array of User has many Billing',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Billing)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Billing>,
  ): Promise<Billing[]> {
    return this.userRepository.billings(id).find(filter);
  }

  @post('/users/{id}/billings', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Billing)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Billing, {
            title: 'NewBillingInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) billing: Omit<Billing, 'id'>,
  ): Promise<Billing> {
    return this.userRepository.billings(id).create(billing);
  }

  @patch('/users/{id}/billings', {
    responses: {
      '200': {
        description: 'User.Billing PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Billing, {partial: true}),
        },
      },
    })
    billing: Partial<Billing>,
    @param.query.object('where', getWhereSchemaFor(Billing)) where?: Where<Billing>,
  ): Promise<Count> {
    return this.userRepository.billings(id).patch(billing, where);
  }

  @del('/users/{id}/billings', {
    responses: {
      '200': {
        description: 'User.Billing DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Billing)) where?: Where<Billing>,
  ): Promise<Count> {
    return this.userRepository.billings(id).delete(where);
  }
}
