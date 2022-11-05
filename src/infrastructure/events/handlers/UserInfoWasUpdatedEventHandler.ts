import { EventHandler } from '../../../infrastructure-interfaces/events/handlers/EventHandler';
import { UserInfoWasUpdatedEvent } from '../../../domain/user/events/UserInfoWasUpdatedEvent';
import { UserDao } from '../../../infrastructure-interfaces/dao/UserDao';
import { UserDto } from '../../../infrastructure-interfaces/dao/dto/UserDto';

export class UserInfoWasUpdatedEventHandler implements EventHandler<UserInfoWasUpdatedEvent> {
  constructor(private readonly userDao: UserDao) {}

  async handle(event: UserInfoWasUpdatedEvent) {
    await this.userDao.saveUserInfo(event.userId.value, UserDto.fromEntity(event.userInfo));
  }
}
