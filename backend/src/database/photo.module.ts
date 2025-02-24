import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { photoProviders } from './photo.providers';
import { PhotoService } from 'src/services/photo.service';

@Module({
  imports: [DatabaseModule],
  providers: [...photoProviders, PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}
