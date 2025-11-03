// import {
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   canActivate(context: ExecutionContext) {
//     // Ajoute la logique de vérification JWT via Passport
//     return super.canActivate(context);
//   }

//   handleRequest(err, user, info) {
//     // Gestion des erreurs JWT
//     if (err || !user) {
//       throw err || UnauthorizedException('Invalid or expired token');
//     }
//     return user;
//   }
// }
// //
