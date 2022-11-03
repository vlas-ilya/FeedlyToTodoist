import { UserDto } from './dto/UserDto';

export interface UserDao {
  findById(value: string): Promise<UserDto>;

  create(value: string): Promise<void>;

  saveUserInfo(value: string, userInfo: UserDto): Promise<void>;

  listIds(): Promise<string[]>;
}
