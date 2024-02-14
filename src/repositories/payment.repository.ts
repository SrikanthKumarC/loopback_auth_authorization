import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Payment, PaymentRelations, User, Billing} from '../models';
import {UserRepository} from './user.repository';
import {BillingRepository} from './billing.repository';

export class PaymentRepository extends DefaultCrudRepository<
  Payment,
  typeof Payment.prototype.id,
  PaymentRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Payment.prototype.id>;

  public readonly billings: HasManyRepositoryFactory<Billing, typeof Payment.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('BillingRepository') protected billingRepositoryGetter: Getter<BillingRepository>,
  ) {
    super(Payment, dataSource);
    // this.billings = this.createHasManyRepositoryFactoryFor('billings', billingRepositoryGetter,);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);


  }

  public async makePayment (id: string) {
    const payment = await this.findById(id);
    payment.isPaid = true;
    await this.save(payment);
    return payment;
  }
}
