import { BaseEvent } from '../../base/BaseEvent';
import { UserInfo } from '../UserInfo';
import { Links } from '../Links';
import { UserId } from '../UserId';

export class TransferUserLinksEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly userInfo: UserInfo, public readonly links: Links) {
    super('TransferUserLinksEvent');
  }
}
