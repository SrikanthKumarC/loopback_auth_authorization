import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {JWTStrategy} from './authentication-strategies/jwt-strategies';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SECURITY_SCHEME_SPEC,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {
  AuthorizationOptions,
  AuthorizationComponent,
  AuthorizationBindings,
  AuthorizationDecision,
  AuthorizationTags
} from '@loopback/authorization';
import {MyAuthorizationProvider} from './authorization/auth-provider';
import {DbDataSource} from './datasources';

export {ApplicationConfig};

export class Test2Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    const optionsAuthorization: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    };

    this.configure(AuthorizationBindings.COMPONENT).to(optionsAuthorization);
    this.component(AuthorizationComponent);
    this.bind('authorizationProviders.my-authorizer-provider')
    .toProvider(MyAuthorizationProvider)
    .tag(AuthorizationTags.AUTHORIZER);

    // ------ ADD SNIPPET AT THE BOTTOM ---------
    // Mount authentication system
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);

    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
    // ------------- END OF SNIPPET -------------
  }
}
