import {injectable} from '@loopback/core';
import {asGreeter, GreetingInterface} from '../types';

@injectable(asGreeter)
export class EnglishGreeter implements GreetingInterface {
  language = 'english';
  sayHi(name: string):string {
    return `Hello, ${name}`
  }
}