import { UserRepository } from '../repository-interfaces/UserRepository';
import { User } from '../domain/user/User';
import { UserId } from '../domain/user/UserId';
import { UserDao } from '../infrastructure-interfaces/dao/UserDao';
import { UserInfo } from '../domain/user/UserInfo';
import { UserDto } from '../infrastructure-interfaces/dao/dto/UserDto';
import { LinkDao } from '../infrastructure-interfaces/dao/LinkDao';
import { Links } from '../domain/user/Links';
import { Link } from '../domain/user/Link';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDao: UserDao, private readonly linkDao: LinkDao) {}

  async getUser(id: UserId): Promise<User> {
    const userInfoDto = await this.userDao.findById(id.value);
    const linkDao = await this.linkDao.findById(id.value);

    return new User(
      new UserId(id.value),
      new UserInfo(
        userInfoDto.feedlyStreamName,
        userInfoDto.feedlyToken,
        userInfoDto.todoistToken,
        userInfoDto.todoistProjectId,
        UserDto.toUserStatus(userInfoDto.userStatus),
      ),
      new Links(linkDao?.value?.map((value) => new Link(value)) ?? []),
    );
  }

  async createEmptyUser(userId: UserId): Promise<void> {
    await this.userDao.create(userId.value);
  }

  async list(): Promise<User[]> {
    const userIdList = await this.userDao.listIds();
    return await Promise.all(userIdList.map(async (id) => await this.getUser(new UserId(id))));
  }
}
