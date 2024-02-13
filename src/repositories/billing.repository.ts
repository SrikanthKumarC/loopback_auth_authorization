import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Billing, BillingRelations, User, Payment} from '../models';
import {UserRepository} from './user.repository';
import {PaymentRepository} from './payment.repository';

export class BillingRepository extends DefaultCrudRepository<
  Billing,
  typeof Billing.prototype.id,
  BillingRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Billing.prototype.id>;

  public readonly payment: BelongsToAccessor<Payment, typeof Billing.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('PaymentRepository') protected paymentRepositoryGetter: Getter<PaymentRepository>,
  ) {
    super(Billing, dataSource);
    this.payment = this.createBelongsToAccessorFor('payment', paymentRepositoryGetter,);
    this.registerInclusionResolver('payment', this.payment.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
