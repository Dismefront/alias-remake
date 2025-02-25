import { Module } from '@nestjs/common';
import { dataProviders } from './data.providers';
import { DataService } from './data.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [...dataProviders, DataService],
  imports: [DatabaseModule],
  exports: [DataService],
})
export class DataModule {}
