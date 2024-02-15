import {injectable, Interceptor, InvocationContext, InvocationResult, Provider, ValueOrPromise} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: EmailValidatorInterceptor.BINDING_KEY}})
export class EmailValidatorInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${EmailValidatorInterceptor.name}`;

  /*
  constructor() {}¯
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {

      const {email} = invocationCtx.args[0];
      if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        throw new HttpErrors.BadRequest('Email is invalid') }

      const parsedEmail = email.toLowerCase();
      invocationCtx.args[0].email = parsedEmail;
      console.log(invocationCtx.args);
      // Add pre-invocation logic here
      // Add post-invocation logic here
      return next();
    }
}
