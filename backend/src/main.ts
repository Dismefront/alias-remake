import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import * as session from 'express-session';

export let sessionMiddleWare;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  sessionMiddleWare = session({
    secret: configService.get('SESSION_SECRET') as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  });

  app.use(sessionMiddleWare);
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
