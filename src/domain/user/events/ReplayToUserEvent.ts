import { BaseEvent } from '../../base/BaseEvent';
import { UserId } from '../UserId';

export class ReplayToUserEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly message: string) {
    super('ReplayToUserEvent');
  }
}
