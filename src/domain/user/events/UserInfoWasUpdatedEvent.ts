import { BaseEvent } from '../../../utils/domain/BaseEvent';
import { UserInfo } from '../UserInfo';
import { UserId } from '../UserId';
import { EventCode } from '../../../constants/EventCode';

export class UserInfoWasUpdatedEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly userInfo: UserInfo) {
    super('UserInfoWasUpdatedEvent');
  }
}
