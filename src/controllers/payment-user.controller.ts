import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Payment,
  User,
} from '../models';
import {PaymentRepository} from '../repositories';

export class PaymentUserController {
  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @get('/payments/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Payment',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<User> {
    return this.paymentRepository.user(id);
  }
}
