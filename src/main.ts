import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import type { OpenAPIObject, SwaggerCustomOptions } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const configService: ConfigService = new ConfigService();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('SAM')
    .setDescription('Sistema de gestión de mascotas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerCustomOptions = {
    customSiteTitle: 'SAM',
    customJsStr: `
    const img = document.createElement("img");
    img.src = "/pets.png";
    img.style.width = "60px";
    img.style.height = "30px";
    const elementInterval = setInterval(function(){
      const topbar = document.querySelector(".topbar-wrapper a");
      const opblock = document.getElementsByClassName("opblock-tag-section");
      if(topbar && opblock){
        Array.from(opblock).forEach((element) => {
          element.classList.remove("is-open");
        });
        topbar.appendChild(img);
        clearInterval(elementInterval);
      }
    }, 100);
    `,
    customCss: `
      .swagger-ui .topbar { background: linear-gradient(90deg, rgba(4,89,163,1) 35%, rgba(42,49,127,1) 100%); }
    `,
    swaggerOptions: {
      persistAuthorization: true,
    },
    customfavIcon: '/favicon.ico',
  };
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);
  await app.listen(configService.getOrThrow<string>('PORT'), '0.0.0.0');
}
void bootstrap();
