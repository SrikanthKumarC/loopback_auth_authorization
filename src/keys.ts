import {BindingKey} from '@loopback/core';
import {UserService} from './services';
/**
 * Strongly-typed binding key for GreetingService
 */
export const GREETING_SERVICE = BindingKey.create<UserService>(
  'services.GreetingService',
);