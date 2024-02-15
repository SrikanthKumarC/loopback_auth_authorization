import {PermissionKeys} from './authorization/permission-keys';
import {BindingKey, BindingTemplate, extensionFor} from '@loopback/core';
import {UserService} from './services';

export interface RequiredPermissions {
  required: PermissionKeys[];
}

export interface MyUserProfile {
  id: string;
  email?: string;
  name: string;
  permissions: PermissionKeys[];
}

export const GREETING_EXTENSION_NAME = 'srikanthGreets';

export interface GreetingInterface {
  language: string;
  sayHi: (name: string) => string;
}

export const asGreeter: BindingTemplate = binding => {
  extensionFor(GREETING_EXTENSION_NAME)(binding);
  binding.tag({namespace: 'greeters'});
};

export const GREETING_SERVICE = BindingKey.create<UserService>(
  'services.GreetingService',
);