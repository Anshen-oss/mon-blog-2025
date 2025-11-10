import { UserEntity } from '@/user/user.entity';
import { User } from '@/user/user/decorators/user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IArticleResponse } from './article-response.interface';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
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

  // ! Récupération d'un Article Unique
  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
    const article = await this.articleService.getSingleArticle(slug);

    return this.articleService.generateArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard('jwt'))
  async deleteArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ) {
    return await this.articleService.deleteArticle(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard('jwt'))
  async updateArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const updatedArticle = await this.articleService.updateArticle(
      slug,
      currentUserId,
      updateArticleDto,
    );

    return this.articleService.generateArticleResponse(updatedArticle);
  }
}
