import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CustomJwtModule, MongooseModuleUser } from '../../utils/customModules';
import { PostModule } from '../post/post.module';
import { AuthController } from './auth.controller';
import { TokenServiceProvider, UserServiceProvider } from './auth.provider';
import { UserRepository } from './repository/user.repository';

@Module({
	imports: [MongooseModuleUser, CustomJwtModule, PassportModule, PostModule],
	controllers: [AuthController],
	providers: [UserRepository, TokenServiceProvider, UserServiceProvider],
	exports: [UserServiceProvider, TokenServiceProvider],
})
export class AuthModule {}
