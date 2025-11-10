import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ArticleEntity } from '../article/article.entity';
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar')
  username: string;

  @Column()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  // 🛡️ TRIPLE PROTECTION DU MOT DE PASSE
  @Exclude() // ⬅️ Niveau 2: Exclure de la sérialisation JSON
  @Column({ select: false }) // ⬅️ Niveau 1: Ne pas récupérer par défaut
  password: string;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  // Optionnel : Normaliser le username
  @BeforeInsert()
  @BeforeUpdate()
  normalizeUsername() {
    if (this.username) {
      this.username = this.username.trim();
    }
  }
}
