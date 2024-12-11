import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../schema/user.schema';

import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
	) {
		super(userModel);
	}
}
