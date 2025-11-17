import { ArticleEntity } from './article.entity';

// articles-response.interface.ts
export interface IArticlesResponse {
  articles: ArticleEntity[]; // ← PLURIEL + tableau
  articlesCount: number;
}
