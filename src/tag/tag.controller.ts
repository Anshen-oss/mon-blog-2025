import { TagService } from '@/tag/tag.service';
import { Controller, Get } from '@nestjs/common';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getAllTags() {
    return 'hello';
  }
}
