import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Protection supplémentaire même si le guard n'a pas fonctionné.
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    // ✅ SI data est fourni (ex: 'id'), retourner cette propriété spécifique
    // ✅ SINON retourner l'objet user entier
    return data ? user[data] : user;
  },
);
