import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global Prefix
    app.setGlobalPrefix('api');

    // Enable CORS
    app.enableCors();

    // Validation Pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Swagger Documentation
    const config = new DocumentBuilder()
        .setTitle('Mystica API')
        .setDescription('The Mystica Platform API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Mystica Backend is running on: http://localhost:${port}/api`);
    console.log(`📖 Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();
