import { IsString } from 'class-validator';

export class InputCommentDTO {
	@IsString()
	readonly postId: string;

	@IsString()
	readonly contents: string;
}
