/**
 * 🛡️ Guard d'authentification JWT
 *
 * ! Ce Guard utilise la stratégie JWT définie précédemment.
 * Il est appliqué sur les routes qui nécessitent une authentification.
 */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 🛡️ Guard d'authentification JWT
 *
 * ! Ce Guard utilise la stratégie JWT définie précédemment.
 * Il est appliqué sur les routes qui nécessitent une authentification.
 */

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * 🎯 Méthode canActivate - Détermine si la requête peut continuer
   *
   * ! @param context - Contexte d'exécution de NestJS
   * ! @returns true si autorisé, sinon lance une exception
   */
  canActivate(context: ExecutionContext) {
    // Appelle la logique Passport JWT
    return super.canActivate(context);
  }

  /**
   * 🚨 Gestion personnalisée des erreurs
   *
   * ! @param err - Erreur levée par Passport
   * ! @param user - Utilisateur (null si échec)
   */

  handleRequest(err: any, user: any) {
    // Si l'erreur est une erreur d'authentification
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('Invalid or missing authentication token')
      );
    }
    return user;
  }
}
