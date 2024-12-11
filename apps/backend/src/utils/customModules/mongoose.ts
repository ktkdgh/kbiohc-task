import { MongooseModule } from '@nestjs/mongoose';
import { Comment, commentSchema } from '../../schema/comment.schema';
import { Post, postSchema } from '../../schema/post.schema';
import { User, userSchema } from '../../schema/user.schema';

export const CustomMongooseModule = MongooseModule.forRoot(
	process.env.MONGODB_URI ?? '',
	{
		dbName: 'kbiohc',
	},
);

// user
export const MongooseModuleUser = MongooseModule.forFeature([
	{ name: User.name, schema: userSchema },
]);

// post
export const MongooseModulePost = MongooseModule.forFeature([
	{ name: Post.name, schema: postSchema },
]);

// comment
export const MongooseModuleComment = MongooseModule.forFeature([
	{ name: Comment.name, schema: commentSchema },
]);
