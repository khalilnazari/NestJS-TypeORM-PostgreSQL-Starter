import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './appConfig/appConfig.service';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  const configService = app.get(AppConfigService);
  const port = configService.appPort() ?? 3000;

  await app
    .listen(port)
    .then(() => console.log(`Server is runing on port ${port}`))
    .catch((error) =>
      console.log(`Could run server. Error: ${JSON.stringify(error)}`),
    );
}

void bootstrap();
