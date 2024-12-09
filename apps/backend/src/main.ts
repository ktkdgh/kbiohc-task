import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // cors 설정
    app.enableCors({
        origin: 'http://localhost:3001',
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
