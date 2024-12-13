import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { getCurrentDate } from '../utils/customModules/time';
import { Post } from './post.schema';
import { IComment } from './types/comment';
import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface CommentDocument extends Comment, Document {
	Mapper(): Omit<IComment, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Comment {
	@Prop({ ref: 'User', type: SchemaTypes.ObjectId })
	userId: User;

	@Prop({ ref: 'Post', type: SchemaTypes.ObjectId })
	postId: Post;

	@Prop({ required: true, type: SchemaTypes.String })
	contents: string;
}

const commentSchema = SchemaFactory.createForClass(Comment);
commentSchema.index({ userId: 1, postId: 1 });
commentSchema.methods = {
	Mapper() {
		return getViewFields<Omit<IComment, '_id'>>(this, [
			'id',
			'userId',
			'postId',
			'contents',
			'createdAt',
			'updatedAt',
		]);
	},
};

export { commentSchema };
