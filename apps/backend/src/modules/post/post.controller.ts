import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { InputCommentDTO } from 'src/dto/post/input-comment.dto';
import { IUserProfileDTO } from '../../dto/auth/user-profile.dto';
import { InputPostDTO } from '../../dto/post/input-post.dto';
import { ValidationPipe } from '../../utils/error/validator/validator.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../auth/guards/jwtOptional-auth.guard';
import { AuthUser } from '../auth/user.decorator';
import { CommentService, CommentServiceToken } from './service/comment.service';
import { PostService, PostServiceToken } from './service/post.service';

@Controller('posts')
export class PostController {
	constructor(
		@Inject(PostServiceToken)
		private readonly postService: PostService,
		@Inject(CommentServiceToken)
		private readonly commentService: CommentService,
	) {}

	@Get('list')
	@UseGuards(JwtOptionalAuthGuard)
	async getPostsInfiniteScroll(
		@AuthUser() user: IUserProfileDTO,
		@Query('pageParam') pageParam: number,
	) {
		pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
		return this.postService.getPostsInfiniteScroll(user?.id, pageParam);
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	createPost(
		@AuthUser() user: IUserProfileDTO,
		@Body(new ValidationPipe(-2000)) dto: InputPostDTO,
	) {
		this.postService.createPost(user.id, dto);
	}

	@Put(':postId')
	@UseGuards(JwtAuthGuard)
	updatePost(
		@AuthUser() user: IUserProfileDTO,
		@Param('postId') postId: string,
		@Body(new ValidationPipe(-2001)) dto: InputPostDTO,
	) {
		this.postService.updatePost(user.id, postId, dto);
	}

	@Delete(':postId')
	@UseGuards(JwtAuthGuard)
	deletePost(
		@AuthUser() user: IUserProfileDTO,
		@Param('postId') postId: string,
	) {
		this.postService.deletePost(user.id, postId);
	}

	@Get('comment/:postId/list')
	@UseGuards(JwtOptionalAuthGuard)
	async getCommentsInfiniteScroll(
		@AuthUser() user: IUserProfileDTO,
		@Param('postId') postId: string,
		@Query('pageParam') pageParam: number,
	) {
		pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
		return this.commentService.getCommentsInfiniteScroll(
			user?.id,
			postId,
			pageParam,
		);
	}

	@Post('comment')
	@UseGuards(JwtAuthGuard)
	createComment(
		@AuthUser() user: IUserProfileDTO,
		@Body(new ValidationPipe(-2002)) dto: InputCommentDTO,
	) {
		this.commentService.createComment(user.id, dto);
	}

	@Put('comment/:commentId')
	@UseGuards(JwtAuthGuard)
	updateComment(
		@AuthUser() user: IUserProfileDTO,
		@Param('commentId') commentId: string,
		@Body(new ValidationPipe(-2003)) dto: InputCommentDTO,
	) {
		this.commentService.updateComment(user.id, commentId, dto);
	}

	@Delete('comment/:commentId')
	@UseGuards(JwtAuthGuard)
	deleteComment(
		@AuthUser() user: IUserProfileDTO,
		@Param('commentId') commentId: string,
	) {
		this.commentService.deleteComment(user.id, commentId);
	}
}
