import {injectable} from '@loopback/core';
import {asGreeter, GreetingInterface} from '../types';

@injectable(asGreeter)
export class TeluguGreeter implements GreetingInterface {
  language = 'telugu';
  sayHi(name: string):string {
    return `Ela unnaru, ${name}`
  }
}