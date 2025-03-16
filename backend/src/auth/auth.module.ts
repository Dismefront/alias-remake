import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/user.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { AdminOnly } from './admin-only.guard';

@Module({
  controllers: [AuthController],
  imports: [UserModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer, AdminOnly],
})
export class AuthModule {}
