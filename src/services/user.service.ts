import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {compare} from 'bcryptjs';
import { User } from '../models';
import {securityId, UserProfile} from '@loopback/security';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(/* Add @inject to inject parameters */) {}

  async validateUser(password: string, hashPassword: string) {
    const isValidUser = await compare(password, hashPassword);
    return isValidUser;
  }

  limitedProperties(user: User): UserProfile {
    const userName = '';
    return {
      [securityId]: user.id!,
      name: userName,
      id: user.id,
      email: user.email,
    };
  }
  /*
   * Add service methods here
   */
}
