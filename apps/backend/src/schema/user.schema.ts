import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { getCurrentDate } from '../utils/customModules/time';
import { IUser } from './types/user';
import { getViewFields } from './utils/getViewFields';

export interface UserDocument extends User, Document {
	Mapper(): Omit<IUser, '_id'>;
}

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class User {
	@Prop({ unique: true, type: SchemaTypes.String })
	username: string;

	@Prop({ type: SchemaTypes.String })
	password: string;

	@Prop({ type: SchemaTypes.String, default: 'defaultValue' })
	refreshToken: string;
}

const userSchema = SchemaFactory.createForClass(User);
userSchema.methods = {
	Mapper() {
		return getViewFields<Omit<IUser, '_id'>>(this, [
			'id',
			'username',
			'password',
			'refreshToken',
			'createdAt',
			'updatedAt',
		]);
	},
};

export { userSchema };
