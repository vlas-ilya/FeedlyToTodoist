import { User } from '../../domain/user/User';

export interface UserService {
  run(userId: string, fun: (user: User) => Promise<void>): Promise<void>;

  createUser(id: string): Promise<void>;

  forEach(fun: (user: User) => void): Promise<void>;
}
