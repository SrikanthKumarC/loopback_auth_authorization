import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {compare} from 'bcryptjs';
import { User } from '../models';
@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(/* Add @inject to inject parameters */) {}

  async validateUser(password: string, hashPassword: string) {
    const isValidUser = await compare(password, hashPassword);
    return isValidUser;
  }

  async limitedProperties(user: User) {
    return {
      email: user.email,
      password: user.password
    }
  }
  /*
   * Add service methods here
   */
}
