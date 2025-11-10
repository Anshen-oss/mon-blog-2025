import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, Repository } from 'typeorm';
import { IArticleResponse } from './article-response.interface';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
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

  async getSingleArticle(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new HttpException('Article introuvable', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  // ! Méthode Réutilisable : findBySlug
  // Pour éviter la duplication de code

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new HttpException('Article introuvable', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    // 1. Trouver l'article
    const article = await this.findBySlug(slug);

    // 2. Vérifier l'auteur de l'article
    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    // 3. Régénérer le slug si le titre change
    if (updateArticleDto.title) {
      article.slug = this.generateSlug(updateArticleDto.title);
    }
    // 4. Copier les nouvelles propriétés
    Object.assign(article, updateArticleDto);

    // 5. Sauvegarder
    return await this.articleRepository.save(article);
  }

  // Service de Suppression
  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = this.findBySlug(slug);

    // Vérification de l'auteur de l'article
    if ((await article).author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    return await this.articleRepository.delete({ slug });
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
