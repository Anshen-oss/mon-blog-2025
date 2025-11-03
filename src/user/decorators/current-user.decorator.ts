/**
 * ? Décorateur @CurrentUser() 🎯
 *
 * ! Permet de récupérer facilement l'utilisateur authentifié dans les contrôleurs.
 *
 * ! Utilisation :
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;
 * }
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/user.type';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
