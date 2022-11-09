import { BaseEvent } from '../../../utils/domain/BaseEvent';
import { UserId } from '../vo/UserId';

export class ReplayToUserEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly message: string) {
    super('ReplayToUserEvent');
  }
}
