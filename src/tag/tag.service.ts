import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  getAll() {
    return ['Ai', 'Javascript', 'nestjs', 'Node.js'];
  }
}
