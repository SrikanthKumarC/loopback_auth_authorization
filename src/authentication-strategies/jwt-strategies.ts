import {AuthenticationStrategy} from '@loopback/authentication';
import {HttpErrors, RedirectRoute} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Request} from 'express';
import {ParamsDictionary} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {promisify} from 'util';
const jwt = require('jsonwebtoken');
const verifyAsync = promisify(jwt.verify);

export class JWTStrategy implements AuthenticationStrategy {
  name: string = 'jwt';
  async authenticate(
    request: Request<ParamsDictionary, ParsedQs>,
  ): Promise<UserProfile | RedirectRoute | undefined> {
    console.log('here inside authenticate');
    try {
      const token: string = this.extractCredentials(request);
      const userProfile = await verifyAsync(token, 'SECRET');
      return userProfile;
    } catch (err: unknown) {
      throw new HttpErrors.Unauthorized((err as Error).message);
    }
  }

  extractCredentials(request: Request<ParamsDictionary, ParsedQs>): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization is missing');
    }
    const authHeaderValue = request.headers.authorization;

    // authorization : Bearer xxxx.yyyy.zzzz
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization header is not type of Bearer',
      );
    }
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header has too many part is must follow this patter 'Bearer xx.yy.zz`,
      );
    }
    const token = parts[1];
    return token;
  }
}
