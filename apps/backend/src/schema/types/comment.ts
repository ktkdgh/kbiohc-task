import { SchemaId } from './id';

interface IComment {
	_id: SchemaId;
	id: string;
	userId: SchemaId;
	postId: SchemaId;
	contents: string;
	createdAt: Date;
	updatedAt: Date;
}

export type { IComment };
