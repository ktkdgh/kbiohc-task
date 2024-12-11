import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
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
				-1608,
			);
		}
	}

	verifyRefreshToken(token: string): IJwtPayload {
		const { JWT_REFRESH_SECRET_KEY } = process.env;

		try {
			return this.jwtService.verify(token, {
				secret: JWT_REFRESH_SECRET_KEY,
			});
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new CustomException(
					'The provided refresh token has expired.',
					HttpStatus.FORBIDDEN,
					-1204,
				);
			} else if (error instanceof JsonWebTokenError) {
				throw new CustomException(
					'There was an issue with the JWT(RefreshToken).',
					HttpStatus.FORBIDDEN,
					-1207,
				);
			} else if (error instanceof SyntaxError) {
				throw new CustomException(
					'There was a syntax error with the provided JWT(RefreshToken).',
					HttpStatus.FORBIDDEN,
					-1210,
				);
			} else {
				throw error;
			}
		}
	}

	verifyAccessToken(token: string): IJwtPayload {
		const { JWT_ACCESS_SECRET_KEY } = process.env;

		try {
			return this.jwtService.verify(token, {
				secret: JWT_ACCESS_SECRET_KEY,
			});
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new CustomException(
					'The provided access token has expired.',
					HttpStatus.UNAUTHORIZED,
					-1101,
				);
			} else if (error instanceof JsonWebTokenError) {
				throw new CustomException(
					'There was an issue with the JWT(AccessToken).',
					HttpStatus.FORBIDDEN,
					-1206,
				);
			} else if (error instanceof SyntaxError) {
				throw new CustomException(
					'There was a syntax error with the provided JWT(AccessToken).',
					HttpStatus.FORBIDDEN,
					-1209,
				);
			} else {
				throw error;
			}
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
}
