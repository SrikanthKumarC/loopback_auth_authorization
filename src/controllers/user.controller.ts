import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
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
  HttpErrors,
} from '@loopback/rest';
import {User} from '../models';

import {inject, service} from '@loopback/core';
import {
  TokenServiceBindings,
  // MyUserService,
  // UserServiceBindings,
  // UserRepository,
} from '@loopback/authentication-jwt';
import {TokenService} from '@loopback/authentication';
import {UserRepository} from '../repositories';
// import {SecurityBindings, UserProfile} from '@loopback/security';
import {hash} from 'bcryptjs';
import {UserService} from '../services';
import {sign} from 'jsonwebtoken';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    // @inject(SecurityBindings.USER, {optional: true})
    // public user: UserProfile,
    @service(UserService) public userService: UserService,
    @repository(UserRepository)
    protected userRepository: UserRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: User,
  ): Promise<User> {
    const {email, password} = user;
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      throw new HttpErrors.BadRequest('Email is invalid');
    if (!(password.length >= 8))
      throw new HttpErrors.BadRequest(
        'Password length must be greater than 8 characters',
      );
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @post('/users/signup')
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: User,
  ): Promise<User> {
    const hashPassword = await hash(user.password, 10);
    user.password = hashPassword;
    return this.userRepository.create(user);
  }

  @post('/users/login')
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: User,
  ): Promise<string> {
    const userFound = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    console.log({userFound});
    if (!userFound) throw HttpErrors.Unauthorized();
    const validUser = await this.userService.validateUser(
      user.password,
      userFound.password,
    );
    console.log({validUser});
    const userProfile = await this.userService.limitedProperties(user);
    console.log({userProfile});
    if (validUser) {
      const token = await sign(userProfile, 'SECRET');
      return token;
    }
    throw new HttpErrors.Unauthorized('Login failed');
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
