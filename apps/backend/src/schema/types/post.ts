import { SchemaId } from './id';

interface IPost {
	_id: SchemaId;
	id: string;
	userId: SchemaId;
	title: string;
	contents: string;
	createdAt: Date;
	updatedAt: Date;
}

export type { IPost };
