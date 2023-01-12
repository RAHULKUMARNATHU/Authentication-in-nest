import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));



const config = new DocumentBuilder()
    .setTitle('Authentication')
    .setDescription('The Auth API Description ')
    .setVersion('1.0')
    .addTag('Auth')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
      )
    // .addBearerAuth('Authorization' , 'header')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

await app.listen(3000);
}
bootstrap();
