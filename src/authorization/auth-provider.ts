import {
  Authorizer,
  AuthorizationContext,
  AuthorizationMetadata,
  AuthorizationDecision,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
export class MyAuthorizationProvider implements Provider<Authorizer> {
  constructor() {}

  /**
   * @returns authenticateFn
   */
  value(): Authorizer {
    console.log('i am called authorization')
    return this.authorize.bind(this);
  }
  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    console.log("AUTHORIZE")
    console.log({metadata})
    const clientRole = authorizationCtx.principals[0].permissions;
    const allowedRoles = metadata.allowedRoles;
    if (!allowedRoles)
      throw new HttpErrors.Unauthorized('Authorization Failed');
    return allowedRoles.includes(clientRole)
      ? AuthorizationDecision.ALLOW
      : AuthorizationDecision.DENY;
  }
}
