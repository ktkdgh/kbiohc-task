import { Body, Controller, Inject, Post } from '@nestjs/common';
import { InputUserDTO } from 'src/dto/auth/input-user.dto';
import { UserService, UserServiceToken } from './service/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(UserServiceToken)
		private readonly userService: UserService,
	) {}

	@Post('signin')
	signin(@Body() dto: InputUserDTO) {
		return this.userService.signin(dto.username, dto.password);
	}
}
