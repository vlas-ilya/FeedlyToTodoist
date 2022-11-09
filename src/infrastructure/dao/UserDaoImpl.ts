import { UserDao } from '../../infrastructure-interfaces/dao/UserDao';
import { UserInfoDto } from '../../infrastructure-interfaces/dao/dto/UserInfoDto';

export class UserDaoImpl implements UserDao {
  private userDtoDatabase: {
    [key: string]: UserInfoDto;
  } = {};

  async findById(id: string): Promise<UserInfoDto> {
    return this.userDtoDatabase[id];
  }

  async create(id: string): Promise<void> {
    this.userDtoDatabase[id] = new UserInfoDto();
  }

  async save(id: string, userInfo: UserInfoDto) {
    this.userDtoDatabase[id] = userInfo;
  }

  async listIds() {
    return Object.keys(this.userDtoDatabase);
  }
}
