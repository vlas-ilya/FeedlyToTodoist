import { UserInfoDto } from './dto/UserInfoDto';

export interface UserDao {
  findById(id: string): Promise<UserInfoDto>;
  create(id: string): Promise<void>;
  save(id: string, userInfoDto: UserInfoDto): Promise<void>;
  listIds(): Promise<string[]>;
}
