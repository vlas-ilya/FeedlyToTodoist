import { UserDao } from '../../infrastructure-interfaces/dao/UserDao';
import { UserInfoDto } from '../../infrastructure-interfaces/dao/dto/UserInfoDto';
import { FileStorageProvider } from '../../infrastructure-interfaces/storage/FileStorageProvider';
import { EntityNotFoundError } from '../../infrastructure-interfaces/dao/errors/EntityNotFoundError';

export class UserDaoImpl implements UserDao {
  private readonly FILE_STORAGE_NAME = `user-dao`;

  constructor(private readonly fileStorageProvider: FileStorageProvider) {}

  async findById(id: string): Promise<UserInfoDto> {
    const fileStorage = await this.fileStorageProvider.getFileStorage(this.FILE_STORAGE_NAME, id);
    const value = await fileStorage.read();

    if (!value) {
      throw new EntityNotFoundError(id);
    }

    const result = new UserInfoDto();
    result.feedlyStreamName = value.feedlyStreamName;
    result.feedlyToken = value.feedlyToken;
    result.todoistToken = value.todoistToken;
    result.todoistProjectId = value.todoistProjectId;
    result.userStatus = value.userStatus;
    result.dailyPlan = value.dailyPlan;

    return result;
  }

  async create(id: string): Promise<void> {
    const fileStorage = await this.fileStorageProvider.getFileStorage(this.FILE_STORAGE_NAME, id);
    await fileStorage.write({});
  }

  async save(id: string, userInfo: UserInfoDto) {
    const fileStorage = await this.fileStorageProvider.getFileStorage(this.FILE_STORAGE_NAME, id);
    await fileStorage.write({
      feedlyStreamName: userInfo.feedlyStreamName,
      feedlyToken: userInfo.feedlyToken,
      todoistToken: userInfo.todoistToken,
      todoistProjectId: userInfo.todoistProjectId,
      userStatus: userInfo.userStatus,
      dailyPlan: userInfo.dailyPlan,
    });
  }

  async listIds() {
    return await this.fileStorageProvider.getFileStorageIds(this.FILE_STORAGE_NAME);
  }
}
