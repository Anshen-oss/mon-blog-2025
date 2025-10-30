import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}
  async getAll() {
    const allTags = await this.tagRepository.find();
    const tags: string[] = allTags.map((tag) => tag.name);
    return { tags };
  }
}
