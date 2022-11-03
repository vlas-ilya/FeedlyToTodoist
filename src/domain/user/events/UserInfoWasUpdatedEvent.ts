import { BaseEvent } from '../../base/BaseEvent';
import { UserInfo } from '../UserInfo';
import { UserId } from '../UserId';

export class UserInfoWasUpdatedEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly userInfo: UserInfo) {
    super('UserInfoWasUpdatedEvent');
  }
}
