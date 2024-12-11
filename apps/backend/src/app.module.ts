import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import mongoose from 'mongoose';
import { LoggerMiddleware } from './middlwares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { CustomConfigModule } from './utils/customModules/config';
import { CustomMongooseModule } from './utils/customModules/mongoose';

@Module({
	imports: [AuthModule, CustomConfigModule, CustomMongooseModule],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	private readonly isDev: boolean = process.env.MODE === 'dev';

	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
		mongoose.set('debug', this.isDev);
	}
}
