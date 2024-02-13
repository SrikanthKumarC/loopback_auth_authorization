import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Billing} from '../models';
import {BillingRepository} from './billing.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly billings: HasManyRepositoryFactory<Billing, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('BillingRepository') protected billingRepositoryGetter: Getter<BillingRepository>,
  ) {
    super(User, dataSource);
    this.billings = this.createHasManyRepositoryFactoryFor('billings', billingRepositoryGetter,);
    this.registerInclusionResolver('billings', this.billings.inclusionResolver);
  }
}
