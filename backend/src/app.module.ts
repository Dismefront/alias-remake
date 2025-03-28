import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './categories/category.module';
import { DataModule } from './data/data.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GameModule } from './games/game.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    CategoryModule,
    DataModule,
    UserModule,
    AuthModule,
    GameModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
