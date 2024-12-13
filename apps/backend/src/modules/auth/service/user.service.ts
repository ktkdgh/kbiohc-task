import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SchemaId } from '../../../schema/types/id';
import { CustomException } from '../../../utils/error/customException';
import { UserRepository } from '../repository/user.repository';
import { TokenService, TokenServiceToken } from './token.service';

export const UserServiceToken = 'UserServiceToken';

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,

		@Inject(TokenServiceToken)
		private readonly tokenService: TokenService,
	) {}

	async signin(username: string, password: string) {
		const user = await this.verifyUser(username, password);

		if (!user) {
			throw new CustomException(
				'check username and password.',
				HttpStatus.BAD_REQUEST,
				-1200,
			);
		}
		const { accessToken, refreshToken } =
			await this.tokenService.issuehToken(user.id);

		const bcryptData = bcrypt.hashSync(refreshToken, bcrypt.genSaltSync());
		await this.tokenService.updateRefreshToken(user.id, bcryptData);

		return { accessToken, bcryptData };
	}

	async getUserInfo(_id: string) {
		const user = await this.userRepository.findOne({ _id }).exec();
		if (!user) {
			throw new CustomException(
				'Not found user.',
				HttpStatus.NOT_FOUND,
				-1201,
			);
		}

		const userInfo = user.Mapper();
		return {
			id: userInfo.id,
			username: userInfo.username,
		};
	}

	userMapper(user: SchemaId) {
		return Object(user).Mapper();
	}

	private async verifyUser(username: string, password: string) {
		const user = await this.userRepository.findOne({ username }).exec();
		if (user && bcrypt.compareSync(password, user.password)) {
			return user.Mapper();
		}
		return null;
	}
}
