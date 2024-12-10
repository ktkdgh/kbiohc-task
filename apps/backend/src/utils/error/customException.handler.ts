import { HttpStatus } from '@nestjs/common';
import { BSONError } from 'bson';
import { CustomException } from './customException';

export class CustomExceptionHandler {
	private readonly error: Error;

	constructor(caughtError: unknown) {
		this.error = caughtError as Error;
	}

	handleException(message: string, code: number) {
		if (this.isBSONError() || this.isCastError()) {
			throw new CustomException(
				message,
				HttpStatus.UNPROCESSABLE_ENTITY,
				code,
			);
		}

		throw this.error;
	}

	private isBSONError(): boolean {
		return this.error instanceof BSONError;
	}

	private isCastError(): boolean {
		return (
			this.error.name === 'CastError' ||
			this.error.message.includes('Cast to ObjectId failed')
		);
	}
}
