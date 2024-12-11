import { TokenService, TokenServiceToken } from './service/token.service';
import { UserService, UserServiceToken } from './service/user.service';

export const TokenServiceProvider = {
	provide: TokenServiceToken,
	useClass: TokenService,
};

export const UserServiceProvider = {
	provide: UserServiceToken,
	useClass: UserService,
};
