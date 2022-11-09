import { UserRepository } from '../repository-interfaces/UserRepository';
import { User } from '../domain/user/User';
import { UserId } from '../domain/user/vo/UserId';
import { UserDao } from '../infrastructure-interfaces/dao/UserDao';
import { LinkDao } from '../infrastructure-interfaces/dao/LinkDao';
import { Links } from '../domain/user/vo/Links';
import { TransferringStatusDao } from '../infrastructure-interfaces/dao/TransferringStatusDao';
import { TransferringStatus } from '../domain/user/vo/TransferringStatus';
import { UserInfoDto } from '../infrastructure-interfaces/dao/dto/UserInfoDto';
import { LinksDto } from '../infrastructure-interfaces/dao/dto/LinksDto';
import { TransferringStatusDto } from '../infrastructure-interfaces/dao/dto/TransferringStatusDto';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly userDao: UserDao,
    private readonly linkDao: LinkDao,
    private readonly transferringStatusDao: TransferringStatusDao,
  ) {}

  async getUser(id: UserId): Promise<User> {
    const userInfoDto = await this.userDao.findById(id.value);
    const linkDto = await this.linkDao.findById(id.value);
    const transferringStatusDto = await this.transferringStatusDao.findById(id.value);

    const userInfo = userInfoDto.toEntity();
    const links = linkDto?.toEntity() || Links.empty();
    const transferringStatus = transferringStatusDto?.toEntity() || TransferringStatus.empty();

    return new User(id.clone(), userInfo, links, transferringStatus);
  }

  async createEmptyUser(userId: UserId): Promise<void> {
    await this.userDao.create(userId.value);
  }

  async list(): Promise<User[]> {
    const userIdList = await this.userDao.listIds();
    return await Promise.all(userIdList.map(async (id) => await this.getUser(new UserId(id))));
  }

  async save(user: User) {
    await user.save(async ([userInfo, links, transferringStatus]) => {
      await this.userDao.save(user.id.value, UserInfoDto.fromEntity(userInfo));
      await this.linkDao.save(user.id.value, LinksDto.fromEntity(links));
      await this.transferringStatusDao.save(user.id.value, TransferringStatusDto.fromEntity(transferringStatus));
    });
  }
}
