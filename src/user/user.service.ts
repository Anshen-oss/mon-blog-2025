import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtPayload } from './types/user.type';
import { UserEntity } from './user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 🛡️ Méthode privée : Niveau 3 de protection - Créer la réponse avec token (sans password)
  private generateUserResponse(user: UserEntity): UserResponseDto {
    const token = this.generateToken(user);

    // Construction explicite de la réponse - le password n'est JAMAIS mentionné
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.image,
        token,
      },
    };
  }

  // 🔐 Méthode privée : Générer un token JWT
  private generateToken(user: UserEntity): string {
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  // ✨ Créer un utilisateur
  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    console.log('🔍 DTO reçu dans service:', createUserDto);

    // 1. Vérifier si l'email existe déjà
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUserByEmail) {
      throw new HttpException(
        'Email already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // 2. Vérifier si le username existe déjà
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // 4. Créer l'utilisateur (le password sera hashé par @BeforeInsert)
    const newUser = this.userRepository.create(createUserDto);

    // 5. Sauvegarder en base de données (@BeforeInsert fait le hash automatiquement)
    const savedUser = await this.userRepository.save(newUser);

    // 6. Retourner la réponse avec token (Niveau 3: sans password)
    return this.generateUserResponse(savedUser);
  }

  // 🔑 CONNEXION
  async login(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    console.log('🎯 DTO reçu dans le service:', loginUserDto);
    // 1. Chercher l'utilisateur par email (avec le password cette fois)
    // On doit explicitement demander le password car select: false
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
      // ⬅️ Inclure password
    });

    console.log('👤 Utilisateur trouvé:', user); // ✨ AJOUTEZ CE LOG
    console.log('🔑 Password trouvé:', user?.password); // ✨ AJOUTEZ CE LOG

    // 2. Vérifier si l'utilisateur existe
    if (!user) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 3. Comparer les mots de passe (bcrypt compare)
    const isPasswordValid = await compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Mot de passe invalide'); // ✨ AJOUTEZ CE LOG
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 4. Retourner la réponse avec token (Niveau 3: sans password)
    return this.generateUserResponse(user);
  }
  // 👤 OBTENIR L'UTILISATEUR ACTUEL (utilisé avec JWT Guard)
  async getCurrentUser(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.generateUserResponse(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  // ✨ Retourner seulement les usernames
  async getAllUserNames(): Promise<{ users: string[] }> {
    const allUsers = await this.userRepository.find();
    const users: string[] = allUsers.map((user) => user.username);
    return { users };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.generateUserResponse(user);
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // ✨ Mettre à jour
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return this.generateUserResponse(updatedUser);
  }
  // ✨ Supprimer
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
