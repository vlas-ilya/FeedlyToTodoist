import { UserDao } from '../../infrastructure-interfaces/dao/UserDao';
import { UserDto } from '../../infrastructure-interfaces/dao/dto/UserDto';

export class UserDaoImpl implements UserDao {
  private userDtoDatabase: {
    [key: string]: UserDto;
  } = {};

  async findById(id: string): Promise<UserDto> {
    return this.userDtoDatabase[id];
  }

  async create(id: string): Promise<void> {
    this.userDtoDatabase[id] = new UserDto();
  }

  async saveUserInfo(id: string, userInfo: UserDto) {
    this.userDtoDatabase[id] = userInfo;
  }

  async listIds() {
    return Object.keys(this.userDtoDatabase);
  }
}
