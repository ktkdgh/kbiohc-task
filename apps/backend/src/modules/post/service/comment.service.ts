import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InputCommentDTO } from '../../../dto/post/input-comment.dto';
import {
	UserService,
	UserServiceToken,
} from '../../../modules/auth/service/user.service';
import { CustomException } from '../../../utils/error/customException';
import { CommentRepository } from '../repository/comment.repository';

export const CommentServiceToken = 'CommentServiceToken';

@Injectable()
export class CommentService {
	constructor(
		private readonly commentRepository: CommentRepository,

		@Inject(UserServiceToken)
		private readonly userService: UserService,
	) {}

	async getCommentsInfiniteScroll(
		currentUserId: string,
		postId: string,
		pageParam: number,
	) {
		const totalCount = await this.getCommentCount(postId);
		const comments = await this.commentRepository
			.find({ postId })
			.populate({ path: 'userId', select: 'username' })
			.sort({ createdAt: -1 })
			.skip(pageParam * 5)
			.limit(5)
			.exec();

		const items = await Promise.all(
			comments.map(async (entity) => {
				const comment = entity.Mapper();
				const user = this.userService.userMapper(comment.userId);

				return {
					comment: {
						id: comment.id,
						contents: comment.contents,
						createdAt: comment.createdAt,
						isMine: currentUserId
							? currentUserId === user.id
							: false,
						username: user.username,
					},
				};
			}),
		);

		const totalPages = Math.ceil(totalCount / 5);
		return { items, totalPages, totalCount };
	}

	async createComment(userId: string, dto: InputCommentDTO) {
		const comment = await this.commentRepository.createComment(userId, dto);

		if (!comment) {
			throw new CustomException(
				'Failed to save comment.',
				HttpStatus.INTERNAL_SERVER_ERROR,
				-2100,
			);
		}
	}

	async updateComment(
		userId: string,
		commentId: string,
		dto: InputCommentDTO,
	) {
		const result = await this.commentRepository
			.updateOne(
				{ _id: commentId, postId: dto.postId, userId },
				{ $set: { contents: dto.contents } },
			)
			.exec();

		if (result.modifiedCount === 0) {
			throw new CustomException(
				'Failed to update comment.',
				HttpStatus.INTERNAL_SERVER_ERROR,
				-2101,
			);
		}
	}

	async deleteComment(userId: string, commentId: string) {
		const result = await this.commentRepository
			.deleteOne({ _id: commentId, userId })
			.exec();

		if (result.deletedCount === 0) {
			throw new CustomException(
				'Failed to delete comment.',
				HttpStatus.INTERNAL_SERVER_ERROR,
				-2102,
			);
		}
	}

	async getCommentCount(postId: string) {
		return this.commentRepository.countDocuments({ postId }).exec();
	}
}
