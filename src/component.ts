import {Binding, Component, createBindingFromClass} from '@loopback/core';
import {TeluguGreeter} from './greeters/telugu-greeter';
import {EnglishGreeter} from './greeters/en-greeter';
import {UserService} from './services';
import {GREETING_SERVICE} from './keys';

/**
 * Define a component to register the greeter extension point and built-in
 * extensions
 */
export class GreetingComponent implements Component {
  bindings: Binding[] = [
    createBindingFromClass(UserService, {
      key: GREETING_SERVICE,
    }),
    createBindingFromClass(EnglishGreeter),
    createBindingFromClass(TeluguGreeter),
  ];
}