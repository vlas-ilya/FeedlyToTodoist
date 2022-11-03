import { BaseEvent } from '../../base/BaseEvent';
import { UserId } from '../UserId';
import { Links } from '../Links';

export class UserLinksWasUpdatedEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly links: Links) {
    super('UserLinksWasUpdatedEvent');
  }
}
