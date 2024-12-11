import { IsString } from 'class-validator';

export class InputUserDTO {
	@IsString()
	readonly username: string;

	@IsString()
	readonly password: string;
}
