import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, Repository } from 'typeorm';
import { IArticleResponse } from './article-response.interface';
import { ArticleEntity } from './article.entity';
import { IArticlesResponse } from './articles-response.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  async findAll(query: any): Promise<IArticlesResponse> {
    // 1️⃣ Créer le Query Builder
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    // 3️⃣ Appliquer les filtres
    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });

      if (author) {
        queryBuilder.andWhere('articles.author.id = :id', {
          id: author?.id,
        });
      } else {
        return { articles: [], articlesCount: 0 };
      }
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    // 2️⃣ Obtenir le compte AVANT les limites
    const articlesCount = await queryBuilder.getCount();

    // 4️⃣ Appliquer la pagination
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
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
