import { UserEntity } from '@/user/user.entity';
import { User } from '@/user/user/decorators/user.decorator';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IArticleResponse } from './article-response.interface';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async createArticle(
    @User() currentUser: UserEntity, //Custom decorator pour récupérer l'utilisateur connecté
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );

    return this.articleService.generateArticleResponse(article);
  }
}
