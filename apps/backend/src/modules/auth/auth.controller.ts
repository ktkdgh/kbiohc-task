import { Body, Controller, Headers, Inject, Post } from '@nestjs/common';
import { InputUserDTO } from 'src/dto/auth/input-user.dto';
import { ValidationPipe } from '../../utils/error/validator/validator.pipe';
import { TokenService, TokenServiceToken } from './service/token.service';
import { UserService, UserServiceToken } from './service/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(UserServiceToken)
		private readonly userService: UserService,
		@Inject(TokenServiceToken)
		private readonly tokenService: TokenService,
	) {}

	@Post('signin')
	signin(@Body(new ValidationPipe(-1000)) dto: InputUserDTO) {
		return this.userService.signin(dto.username, dto.password);
	}

	@Post('refresh')
	async verifyRefreshToken(@Headers('authorization') header: string) {
		const refreshToken = header?.split('Bearer ')[1];
		return this.tokenService.verifyToken(refreshToken);
	}
}
