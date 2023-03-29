import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { Role } from './user.enum';
// import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const userRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const AuthUser = createParamDecorator((data, req) => {
  console.log(data);
  return req.user;
});
