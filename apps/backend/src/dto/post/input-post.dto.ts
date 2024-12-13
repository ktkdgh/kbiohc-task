import { IsString } from 'class-validator';

export class InputPostDTO {
	@IsString()
	readonly title: string;

	@IsString()
	readonly contents: string;
}
