import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/exceptions/http.exception';
import { HttpResponseInterceptor } from './shared/interceptors/http-response.interceptor';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
// import helmet from 'helmet';
// import * as compression from 'compression';
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
const app = await NestFactory.create(AppModule

);
app.useGlobalPipes(new ValidationPipe({
whitelist: true,
transform: true,  
}));

// app.use(cookieParser())
// app.use(compression());
// app.use(helmet());
app.enableCors({
origin: '*',
methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
credentials: true,

});
app.setGlobalPrefix('api');
const port = parseInt(String(process.env.PORT)) 

const { httpAdapter } = app.get(HttpAdapterHost);
app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
app.useGlobalInterceptors(new HttpResponseInterceptor());

const config = new DocumentBuilder() 
.setTitle('Musicapp')
.setDescription('A Musicapp Api documentation')
.setVersion('1.0')
.addBearerAuth()
.build();

const document = SwaggerModule.createDocument(app, config); 
SwaggerModule.setup("api/docs", app, document, {
customSiteTitle: "Api Docs",
customfavIcon: "https://avatars.githubusercontent.com/u/6936373?s=200&v=4",
customJs: [
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
],
customCssUrl: [
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css",
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
],
swaggerOptions: {
persistAuthorization: true,
},
});

app.getHttpAdapter().get('/api', (_, res) => {
  res.redirect('/api/docs');
});
await app.listen(4000);
}

bootstrap();
