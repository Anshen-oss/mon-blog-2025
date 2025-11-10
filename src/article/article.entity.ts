import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  slug: string;

  @Column()
  body: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'simple-array' })
  tagList: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: 0 })
  favoritesCount: number;

  // 👤 Relation avec l'auteur
  @ManyToOne(() => UserEntity, (user) => user.articles)
  author: UserEntity;

  @Column()
  @JoinColumn({ name: 'authorId' })
  authorId: number;

  // 🔄 Hook pour mettre à jour updatedAt
  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
