import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Billing, Payment, BillingRelations} from '../models';
import {PaymentRepository} from '../repositories';
import {authorize} from '@loopback/authorization';
import {authenticate} from '@loopback/authentication';
import {BillingRepository} from '../repositories';

interface ExtendedPayment<T> {
  bill: T;
  id?: string | undefined;
  billId: string;
  isPaid: boolean;
  userId: string;
}
@authenticate('jwt')
export class PaymentController {
  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
    @repository(BillingRepository)
    public billingRepository: BillingRepository,
  ) {}

  @post('/payments')
  @response(200, {
    description: 'Payment model instance',
    content: {'application/json': {schema: getModelSchemaRef(Payment)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {
            title: 'NewPayment',
            exclude: ['id'],
          }),
        },
      },
    })
    payment: Omit<Payment, 'id'>,
  ): Promise<Payment> {
    return this.paymentRepository.create(payment);
  }

  @authorize({
    allowedRoles: ['ADMIN'],
  })
  @get('/payments')
  @response(200, {
    description: 'Array of Payment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Payment, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Payment) filter?: Filter<Payment>,
  ): Promise<ExtendedPayment<Billing & BillingRelations>[]> {
    const payments = await this.paymentRepository.find(filter);
    const billedPayments: ExtendedPayment<Billing & BillingRelations>[] = [];
    for (const payment of payments) {
      const bill = await this.billingRepository.findById(payment.billId);
      billedPayments.push({...payment, bill});
    }
    return billedPayments;
  }

  @get('/payments/{id}')
  @response(200, {
    description: 'Payment model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Payment, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Payment, {exclude: 'where'})
    filter?: FilterExcludingWhere<Payment>,
  ): Promise<Payment> {
    return this.paymentRepository.findById(id, filter);
  }

  @get(`/payments/makePayment/{id}`)
  async makePayment(@param.path.string('id') id: string) {
    return this.paymentRepository.makePayment(id);
  }

  @patch('/payments/{id}')
  @response(204, {
    description: 'Payment PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {partial: true}),
        },
      },
    })
    payment: Payment,
  ): Promise<void> {
    await this.paymentRepository.updateById(id, payment);
  }

  @put('/payments/{id}')
  @response(204, {
    description: 'Payment PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() payment: Payment,
  ): Promise<void> {
    await this.paymentRepository.replaceById(id, payment);
  }

  @del('/payments/{id}')
  @response(204, {
    description: 'Payment DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.paymentRepository.deleteById(id);
  }
}
