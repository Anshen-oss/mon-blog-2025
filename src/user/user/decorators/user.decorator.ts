import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Protection supplémentaire même si le guard n'a pas fonctionné.
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    return user;
  },
);
