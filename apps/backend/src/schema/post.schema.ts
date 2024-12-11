import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { getCurrentDate } from '../utils/customModules/time';
import { IPost } from './types/post';
import { User } from './user.schema';
import { getViewFields } from './utils/getViewFields';

export interface PostDocument extends Post, Document {
	Mapper(): Omit<IPost, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Post {
	@Prop({ index: true, ref: 'User', type: SchemaTypes.ObjectId })
	userId: User;

	@Prop({ required: true, type: SchemaTypes.String })
	title: string;

	@Prop({ required: true, type: SchemaTypes.String })
	contents: string;
}

const postSchema = SchemaFactory.createForClass(Post);
postSchema.methods = {
	Mapper() {
		return getViewFields<Omit<IPost, '_id'>>(this, [
			'id',
			'userId',
			'title',
			'contents',
			'createdAt',
			'updatedAt',
		]);
	},
};

export { postSchema };
