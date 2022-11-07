import { EventHandler } from '../../../infrastructure-interfaces/events/handlers/EventHandler';
import { UserInfoWasUpdatedEvent } from '../../../domain/user/events/UserInfoWasUpdatedEvent';
import { UserDao } from '../../../infrastructure-interfaces/dao/UserDao';
import { UserInfoDto } from '../../../infrastructure-interfaces/dao/dto/UserInfoDto';

export class UserInfoWasUpdatedEventHandler implements EventHandler<UserInfoWasUpdatedEvent> {
  constructor(private readonly userDao: UserDao) {}

  async handle(event: UserInfoWasUpdatedEvent) {
    await this.userDao.saveUserInfo(event.userId.value, UserInfoDto.fromEntity(event.userInfo));
  }
}
