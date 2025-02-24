import { Controller, Get } from '@nestjs/common';
import { PhotoService } from './services/photo.service';
import { Photo } from './database/photo.entity';

@Controller()
export class AppController {
  constructor(private readonly photoService: PhotoService) {}

  @Get()
  async getHello(): Promise<Photo[]> {
    return await this.photoService.findAll();
  }
}
