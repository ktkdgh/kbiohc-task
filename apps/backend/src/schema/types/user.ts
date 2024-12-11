import { SchemaId } from './id';

interface IUser {
	_id: SchemaId;
	id: string;
	username: string;
	password: string;
	refreshToken?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type { IUser };
