import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './user.decorator';
import { Role } from './user.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    // console.log(
    //   'context',
    //   context.switchToHttp().getRequest().header('x-auth-token'),
    // );

    // const { user } = context.switchToHttp().getRequest();
    // return requiredRoles.some((role) => user.roles?.includes(role));

    let recivedJWT = context.switchToHttp().getRequest().header('x-auth-token');
    // console.log(recivedJWT);
    let data = this.jwtService.verify(recivedJWT, { secret: 'secret' });
    // console.log(data);

    if (data._id) return true;
    return false;
    // return false;
  }
}
