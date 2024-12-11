import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService, TokenServiceToken } from '../service/token.service';
import { UserService, UserServiceToken } from '../service/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		@Inject(UserServiceToken)
		private readonly userService: UserService,
		@Inject(TokenServiceToken)
		private readonly tokenService: TokenService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<Request>();
		const { payload } = this.validateRequest(request);
		const user = await this.userService.getUserInfo(payload.sub.id);
		request.user = user;

		return true;
	}

	private validateRequest(request: Request) {
		const accessToken = request.headers.authorization?.split(
			'Bearer ',
		)[1] as string;
		return this.tokenService.verifyAccessToken(accessToken);
	}
}
