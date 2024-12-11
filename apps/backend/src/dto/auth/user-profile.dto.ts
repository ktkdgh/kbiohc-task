import { IUser } from '../../schema/types/user';

type IUserProfileDTO = Pick<IUser, 'id' | 'username' | 'refreshToken'>;

export type { IUserProfileDTO };
