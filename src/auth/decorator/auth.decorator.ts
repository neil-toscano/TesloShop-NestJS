import { UseGuards, applyDecorators } from '@nestjs/common';
import { validRoles } from '../interfaces/valid-roles.interface';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { AuthGuard } from '@nestjs/passport';

export function Auth(...roles: validRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
