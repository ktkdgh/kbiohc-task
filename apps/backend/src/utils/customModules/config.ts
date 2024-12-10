import { ConfigModule } from '@nestjs/config';

export const configs = () => {
	const env = process.env;

	if (!env) {
		return {};
	}

	return {
		MONGODB_URI: env.MONGODB_URI,
		MODE: env.MODE,
	};
};

export const CustomConfigModule = ConfigModule.forRoot({
	cache: true,
	isGlobal: true,
	envFilePath: `${process.cwd()}/.env`,
	load: [configs],
});
