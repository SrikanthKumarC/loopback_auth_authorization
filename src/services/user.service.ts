import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {compare, hash} from 'bcryptjs';
import { User } from '../models';
import {UserRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {securityId, UserProfile} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';
import {sign} from 'jsonwebtoken';

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(/* Add @inject to inject parameters */
  @repository(UserRepository) public userRepository: UserRepository) {}

  async validateUser(password: string, hashPassword: string) {
    const isValidUser = await compare(password, hashPassword);
    return isValidUser;
  }

  async signUp(user: User): Promise<User> {
    const hashPassword = await hash(user.password, 10);
    user.password = hashPassword;
    return this.userRepository.create(user);
  }

  async login(user: User): Promise<string> {
    const userFound = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    console.log({userFound});
    if (!userFound) throw HttpErrors.Unauthorized();
    const validUser = await this.validateUser(
      user.password,
      userFound.password,
    );
    const {...validObjectForUser} = userFound;
    console.log({validUser});
    const userProfile = this.limitedProperties(user);
    console.log({userProfile});
    if (validUser) {
      const token = sign(validObjectForUser, 'SECRET');
      return token;
    }
    throw new HttpErrors.Unauthorized('Login failed');
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
