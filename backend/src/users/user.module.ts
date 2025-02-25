import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [UserController],
  providers: [...userProviders, UserService],
  exports: [UserService],
  imports: [DatabaseModule],
})
export class UserModule {}
