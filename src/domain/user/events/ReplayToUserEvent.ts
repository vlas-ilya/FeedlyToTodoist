import { BaseEvent } from '../../../utils/domain/BaseEvent';
import { UserId } from '../vo/UserId';
import {EventCode} from "../../../constants/EventCode";

export class ReplayToUserEvent extends BaseEvent {
  constructor(public readonly userId: UserId, public readonly message: string) {
    super('ReplayToUserEvent');
  }
}
