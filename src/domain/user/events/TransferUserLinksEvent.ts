import { BaseEvent } from '../../../utils/domain/BaseEvent';
import { UserInfo } from '../vo/UserInfo';
import { Links } from '../vo/Links';
import { UserId } from '../vo/UserId';
import { EventCode } from '../../../constants/EventCode';

export class TransferUserLinksEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly userInfo: UserInfo, public readonly links: Links) {
    super('TransferUserLinksEvent');
  }
}
