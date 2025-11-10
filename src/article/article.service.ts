import { UserEntity } from '@/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { IArticleResponse } from './article-response.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    user: UserEntity,
    CreateArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    // 1️⃣ Créer une instance vide de l'article
    const article = new ArticleEntity();

    // 2️⃣ Assigner l'auteur de l'article
    article.author = user;

    // 3️⃣ Copier les propriétés du DTO
    Object.assign(article, CreateArticleDto);

    // 4️⃣ Gérer tagList optionnel
    if (!article.tagList) {
      article.tagList = [];
    }

    // 5️⃣ Générer le slug
    article.slug = this.generateSlug(article.title);

    // 6️⃣ Sauvegarder en base de données
    return await this.articleRepository.save(article);
  }

  private generateSlug(title: string): string {
    // Générer un ID unique
    const uniqueId = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);

    // Créer le slug avec slugify
    return slugify(title, { lower: true }) + '-' + uniqueId;
  }

  generateArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }
}
