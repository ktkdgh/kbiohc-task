import { forwardRef, Module } from '@nestjs/common';
import {
	MongooseModuleComment,
	MongooseModulePost,
} from '../../utils/customModules';
import { AuthModule } from '../auth/auth.module';
import { PostController } from './post.controller';
import { CommentServiceProvider, PostServiceProvider } from './post.provider';
import { CommentRepository } from './repository/comment.repository';
import { PostRepository } from './repository/post.repository';

@Module({
	imports: [
		MongooseModulePost,
		MongooseModuleComment,
		forwardRef(() => AuthModule),
	],
	controllers: [PostController],
	providers: [
		PostRepository,
		CommentRepository,
		PostServiceProvider,
		CommentServiceProvider,
	],
	exports: [PostServiceProvider, CommentServiceProvider],
})
export class PostModule {}
