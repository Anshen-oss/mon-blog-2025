import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/user.type';

/**
 * 🎯 Stratégie JWT Passport
 *  Utilise ConfigService pour une gestion propre et idiomatique NestJS.
 * Cette stratégie est automatiquement appelée par le Guard JWT.
 *
 * Elle vérifie et décode le token, puis valide le payload.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    // ✅ ConfigService gère automatiquement les variables d'environnement

    super({
      // 🔍 Où chercher le token ?
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ⚠️ Rejeter les tokens expirés
      ignoreExpiration: false,

      // 🔑 Secret pour vérifier la signature
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * 🔐 Méthode validate() appelée automatiquement
   *
   * Si le token est valide, cette méthode reçoit le payload décodé.
   * Ce qu'elle retourne sera attaché à request.user
   *
   * @param payload - Données décodées du JWT (id, username, email)
   * @returns L'objet qui sera disponible via @CurrentUser()
   */
  validate(payload: JwtPayload) {
    // ✅ Validation basique : vérifier que le payload contient un ID
    if (!payload.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // 🎯 Ce qu'on retourne ici sera dans request.user
    // Pas besoin de requête DB ! Toutes les infos sont dans le token
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
    };
  }
}
