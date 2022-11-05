import { UserRepository } from '../repository-interfaces/UserRepository';
import { User } from '../domain/user/User';
import { UserId } from '../domain/user/vo/UserId';
import { UserDao } from '../infrastructure-interfaces/dao/UserDao';
import { LinkDao } from '../infrastructure-interfaces/dao/LinkDao';
import { Links } from '../domain/user/vo/Links';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDao: UserDao, private readonly linkDao: LinkDao) {}

  async getUser(id: UserId): Promise<User> {
    const userInfoDto = await this.userDao.findById(id.value);
    const linkDto = await this.linkDao.findById(id.value);

    const userInfo = userInfoDto.toEntity();
    const links = linkDto?.toEntity() || new Links([]);

    return new User(id.clone(), userInfo, links);
  }

  async createEmptyUser(userId: UserId): Promise<void> {
    await this.userDao.create(userId.value);
  }

  async list(): Promise<User[]> {
    const userIdList = await this.userDao.listIds();
    return await Promise.all(userIdList.map(async (id) => await this.getUser(new UserId(id))));
  }
}
