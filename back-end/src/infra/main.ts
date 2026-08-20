import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { ApiExceptionFilter } from './http/filters/api-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const env = app.get(EnvService);

  app.use(helmet());
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableShutdownHooks();
  app.enableCors({
    origin: env
      .get('CORS_ORIGINS')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  });

  if (env.get('DOCUMENTATION_ENABLED')) {
    const swaggerConfiguration = new DocumentBuilder()
      .setTitle('API de Análise de Compras Públicas')
      .setDescription(
        'API governamental para consulta e análise da participação de microempresas nas compras públicas municipais.',
      )
      .setVersion('1.0')
      .addTag('Análises de licitações')
      .addTag('Participação de microempresas')
      .addTag('Empresas fornecedoras')
      .addTag('Contratos públicos')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfiguration);

    SwaggerModule.setup('documentacao', app, document, {
      jsonDocumentUrl: 'documentacao-json',
      customSiteTitle: 'Documentação da API de Compras Públicas',
    });
  }

  await app.listen(3000);
}

void bootstrap();
