import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../../schema/comment.schema';

import { InputCommentDTO } from '../../../dto/post/input-comment.dto';
import { BaseRepository } from '../../base/base.repository';

@Injectable()
export class CommentRepository extends BaseRepository<CommentDocument> {
	constructor(
		@InjectModel(Comment.name)
		private readonly commentModel: Model<CommentDocument>,
	) {
		super(commentModel);
	}

	async createComment(userId: string, commentInfo: InputCommentDTO) {
		const comment = new this.commentModel({ ...commentInfo, userId });
		const savedComment = await comment.save();
		return savedComment.Mapper();
	}
}
