import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),

    // ! Configuration Passport 🔐
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // ! Configuration JWT 🎫
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],

  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
