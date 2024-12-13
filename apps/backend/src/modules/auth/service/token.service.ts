import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CustomException } from '../../../utils/error/customException';
import { IJwtPayload } from '../interfaces/jwtPayload';
import { UserRepository } from '../repository/user.repository';

export const TokenServiceToken = 'TokenServiceToken';

@Injectable()
export class TokenService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
	) {}

	async issuehToken(userId: string) {
		const [accessToken, refreshToken] = await Promise.all([
			this.issueAccessToken(userId),
			this.issueRefreshToken(userId),
		]);

		return { accessToken, refreshToken };
	}

	async updateRefreshToken(_id: string, refreshToken: string) {
		const result = await this.userRepository
			.updateOne({ _id }, { $set: { refreshToken } })
			.exec();

		if (result.modifiedCount === 0) {
			throw new CustomException(
				'Failed to update the refresh token.',
				HttpStatus.INTERNAL_SERVER_ERROR,
				-1100,
			);
		}
	}

	async verifyToken(token: string) {
		const { payload } = this.verifyRefreshToken(token);
		const user = await this.userRepository
			.findOne({ _id: payload.sub.id })
			.exec();

		if (!user) {
			throw new CustomException(
				'Not found for the specified user info.',
				HttpStatus.FORBIDDEN,
				-1101,
			);
		}

		const isMatched = bcrypt.compareSync(token, user.refreshToken);
		if (!isMatched) {
			await this.userRepository
				.updateOne(
					{ _id: user.id },
					{ $set: { refreshToken: 'defaultValue' } },
				)
				.exec();

			throw new CustomException(
				'Refresh token mismatch.',
				HttpStatus.FORBIDDEN,
				-1102,
			);
		}

		return this.issuehToken(user.id);
	}

	verifyRefreshToken(token: string): IJwtPayload {
		const { JWT_REFRESH_SECRET_KEY } = process.env;

		try {
			return this.jwtService.verify(token, {
				secret: JWT_REFRESH_SECRET_KEY,
			});
		} catch (error) {
			this.handleJwtError(error, 'refresh');
		}
	}

	verifyAccessToken(token: string): IJwtPayload {
		const { JWT_ACCESS_SECRET_KEY } = process.env;

		try {
			return this.jwtService.verify(token, {
				secret: JWT_ACCESS_SECRET_KEY,
			});
		} catch (error) {
			this.handleJwtError(error, 'access');
		}
	}

	private issueAccessToken(
		id: string,
		options?: JwtSignOptions,
	): Promise<string> {
		const { JWT_ACCESS_SECRET_KEY } = process.env;
		const payload = { sub: { id } };

		return this.jwtService.signAsync(
			{ type: 'access', payload },
			{
				secret: JWT_ACCESS_SECRET_KEY,
				expiresIn: '2h',
				notBefore: '0h',
				...options,
			},
		);
	}

	private issueRefreshToken(
		id: string,
		options?: JwtSignOptions,
	): Promise<string> {
		const { JWT_REFRESH_SECRET_KEY } = process.env;
		const payload = { sub: { id } };

		return this.jwtService.signAsync(
			{ type: 'refresh', payload },
			{
				secret: JWT_REFRESH_SECRET_KEY,
				expiresIn: '14d',
				notBefore: '0h',
				...options,
			},
		);
	}

	private handleJwtError(error: any, type: 'access' | 'refresh') {
		if (error instanceof TokenExpiredError) {
			if (type === 'access') {
				throw new CustomException(
					`${type} token has expired.`,
					HttpStatus.UNAUTHORIZED,
					-1103,
				);
			}
			throw new CustomException(
				`${type} token has expired.`,
				HttpStatus.FORBIDDEN,
				-1104,
			);
		}

		if (
			error instanceof JsonWebTokenError ||
			error instanceof SyntaxError
		) {
			throw new CustomException(
				`There was an issue with the ${type}Token.`,
				HttpStatus.FORBIDDEN,
				-1105,
			);
		}

		throw error;
	}
}
