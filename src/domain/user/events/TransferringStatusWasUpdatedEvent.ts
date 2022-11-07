import { BaseEvent } from '../../../utils/domain/BaseEvent';
import { UserId } from '../vo/UserId';
import { TransferringStatus } from '../vo/TransferringStatus';

export class TransferringStatusWasUpdatedEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly transferringStatus: TransferringStatus) {
    super('TransferringStatusWasUpdatedEvent');
  }
}
