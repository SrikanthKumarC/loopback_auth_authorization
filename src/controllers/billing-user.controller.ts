import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Billing,
  User,
} from '../models';
import {BillingRepository} from '../repositories';

export class BillingUserController {
  constructor(
    @repository(BillingRepository)
    public billingRepository: BillingRepository,
  ) { }

  @get('/billings/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Billing',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Billing.prototype.id,
  ): Promise<User> {
    return this.billingRepository.user(id);
  }
}
