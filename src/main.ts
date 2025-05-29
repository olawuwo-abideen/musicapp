import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/exceptions/http.exception';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,  
}));
    
    app.use(cookieParser())
    app.use(compression());
    app.use(helmet());
    app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    
  });

    const port = parseInt(String(process.env.PORT)) 

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));


  const config = new DocumentBuilder() 
    .setTitle('Musicapp')
    .setDescription('A Musicapp Api documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config); 
  SwaggerModule.setup('api-docs', app, document,{
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port, '0.0.0.0');

}
bootstrap();


