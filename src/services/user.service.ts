import {injectable, inject, BindingScope, extensions, extensionPoint} from '@loopback/core';
import {compare, hash} from 'bcryptjs';
import { User } from '../models';
import {UserRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {securityId, UserProfile} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';
import {sign} from 'jsonwebtoken';
import {extensionFilter, CoreTags, Getter} from '@loopback/core';
import {GREETING_EXTENSION_NAME, GreetingInterface} from '../types';
@injectable({scope: BindingScope.TRANSIENT})
@extensionPoint(GREETING_EXTENSION_NAME)
export class UserService {
  constructor(/* Add @inject to inject parameters */
  @repository(UserRepository) public userRepository: UserRepository,
              @extensions()
              private getGreeters: Getter<GreetingInterface[]>
              ) {}

  async findGreeter(language: string):Promise<GreetingInterface | undefined>  {
    const greeterFunctions = await this.getGreeters()
    return greeterFunctions.find((fun) => {
      return fun.language === language
    })
  }

  async greet(language: string, name: string): Promise<string> {
    const greeter = await this.findGreeter(language);
    if (!greeter) {
      return `Hello, ${name}`
    }
    return greeter.sayHi(name);
  }
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
