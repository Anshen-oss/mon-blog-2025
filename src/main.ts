import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import 'tsconfig-paths/register';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🛡️ Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Enlève les propriétés non définies dans le DTO
      transform: true, // Transform les payloads en instances de DTO
      forbidNonWhitelisted: true, // Erreur si propriétés non autorisées
    }),
  );

  // 🛡️ Sérialisation globale - ESSENTIEL pour @Exclude()
  // Activer globalement
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // CORS (si nécessaire)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
