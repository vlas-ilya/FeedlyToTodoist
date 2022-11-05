import { User } from '../domain/user/User';
import { UserId } from '../domain/user/vo/UserId';

export interface UserRepository {
  getUser(id: UserId): Promise<User>;
  createEmptyUser(userId: UserId): Promise<void>;
  list(): Promise<User[]>;
}
