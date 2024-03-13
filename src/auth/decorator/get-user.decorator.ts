import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user)
      throw new InternalServerErrorException('User not found(request)');
    if (!data) return user;

    const emailUser = data.find((element: string) => element === 'email');
    if (!emailUser)
      throw new InternalServerErrorException('no existe dicho campo');

    return user.email;
  },
);
