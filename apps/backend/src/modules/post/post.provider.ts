import { CommentService, CommentServiceToken } from './service/comment.service';
import { PostService, PostServiceToken } from './service/post.service';

export const PostServiceProvider = {
	provide: PostServiceToken,
	useClass: PostService,
};

export const CommentServiceProvider = {
	provide: CommentServiceToken,
	useClass: CommentService,
};
