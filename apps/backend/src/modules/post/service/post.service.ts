import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InputPostDTO } from '../../../dto/post/input-post.dto';
import {
	UserService,
	UserServiceToken,
} from '../../../modules/auth/service/user.service';
import { CustomException } from '../../../utils/error/customException';
import { CommentRepository } from '../repository/comment.repository';
import { PostRepository } from '../repository/post.repository';
import { CommentService, CommentServiceToken } from './comment.service';

export const PostServiceToken = 'PostServiceToken';

@Injectable()
export class PostService {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly commentRepository: CommentRepository,

		@Inject(forwardRef(() => CommentServiceToken))
		private readonly commentService: CommentService,
		@Inject(UserServiceToken)
		private readonly userService: UserService,
	) {}

	async getPostsInfiniteScroll(currentUserId: string, pageParam: number) {
		const totalCount = await this.postRepository.countDocuments().exec();

		const posts = await this.postRepository
			.find({})
			.populate({ path: 'userId', select: 'username' })
			.sort({ createdAt: -1 })
			.skip(pageParam * 10)
			.limit(10)
			.exec();

		const items = await Promise.all(
			posts.map(async (entity) => {
				const post = entity.Mapper();
				const user = this.userService.userMapper(post.userId);

				return {
					post: {
						id: post.id,
						title: post.title,
						contents: post.contents,
						createdAt: post.createdAt,
						isMine: currentUserId
							? currentUserId === user.id
							: false,
						commentCount: await this.commentService.getCommentCount(
							post.id,
						),
						username: user.username,
					},
				};
			}),
		);

		const totalPages = Math.ceil(totalCount / 10);
		return { items, totalPages };
	}

	async createPost(userId: string, dto: InputPostDTO) {
		const post = await this.postRepository.createPost(userId, dto);

		if (!post) {
			throw new CustomException(
				'Failed to save post.',
				HttpStatus.INTERNAL_SERVER_ERROR,
				-2200,
			);
		}
	}

	async updatePost(userId: string, postId: string, dto: InputPostDTO) {
		const result = await this.postRepository
			.updateOne(
				{ _id: postId, userId },
				{ $set: { contents: dto.contents, title: dto.title } },
			)
			.exec();

		if (result.modifiedCount === 0) {
			throw new CustomException(
				'Failed to update post.',
				HttpStatus.INTERNAL_SERVER_ERROR,
				-2201,
			);
		}
	}

	async deletePost(userId: string, postId: string) {
		const result = await this.postRepository
			.deleteOne({ _id: postId, userId })
			.exec();

		if (result.deletedCount === 0) {
			throw new CustomException(
				'Failed to delete post.',
				HttpStatus.INTERNAL_SERVER_ERROR,
				-2201,
			);
		}

		const commentResult = await this.commentRepository
			.deleteMany({ postId })
			.exec();

		if (commentResult.deletedCount === 0) {
			throw new CustomException(
				'Failed to delete post.',
				HttpStatus.INTERNAL_SERVER_ERROR,
				-2202,
			);
		}
	}
}
