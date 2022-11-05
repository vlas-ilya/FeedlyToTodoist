import { BaseEvent } from '../../../utils/domain/BaseEvent';
import { UserId } from '../vo/UserId';
import { Links } from '../vo/Links';
import { EventCode } from '../../../constants/EventCode';

export class UserLinksWasUpdatedEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly links: Links) {
    super('UserLinksWasUpdatedEvent');
  }
}
