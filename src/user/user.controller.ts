import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from './types/user.type';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ! PUBLIC - Inscription 👤 UTILISATEUR
  @Post('register') // ⬅️ Ajoutez 'register'
  @UsePipes(new ValidationPipe())
  async registerUser(@Body('user') createUserDto: CreateUserDto) {
    console.log('🎯 DTO reçu dans contrôleur:', createUserDto);
    return this.userService.register(createUserDto);
  }

  // 🔑 CONNEXION
  @Post('login')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async login(@Body('user') loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  // ! UTILISATEUR ACTUEL (route protégée par JWT) 👤
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: JwtPayload) {
    // L'utilisateur est automatiquement injecté via @CurrentUser()
    return this.userService.getCurrentUser(user.id);
  }
  // ! PROTÉGÉ - Mettre à jour son propre profil 🔐
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentUser(
    @CurrentUser('id') userId: number,
    @Body('user') UpdateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, UpdateUserDto);
  }

  // ! PROTÉGÉ - Supprimer son propre compte 🔐
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCurrentUser(@CurrentUser('id') userId: number) {
    return this.userService.remove(userId);
  }

  // ! PUBLIC ou ADMIN - Liste des utilisateurs ✅
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  // ! PUBLIC - Un utilisateur par ID ✅
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // ! ADMIN SEULEMENT - Mettre à jour n'importe quel utilisateur 🔐 A

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, AdminGuard) // À ajouter si vous avez des rôles
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // ! 🔐 ADMIN SEULEMENT - Supprimer n'importe quel utilisateur
  @Delete(':id')
  // @UseGuards(JwtAuthGuard, AdminGuard) // À ajouter si vous avez des rôles
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
