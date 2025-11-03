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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  // 👤 UTILISATEUR ACTUEL (route protégée par JWT)
  // @Get('me')
  // @UseGuards(JwtAuthGuard)
  // async getCurrentUser(@Request() req) {
  //   return this.userService.getCurrentUser(req.user.id);
  // }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
