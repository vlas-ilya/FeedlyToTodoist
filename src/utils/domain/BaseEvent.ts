import { EventCode } from '../../constants/EventCode';

export abstract class BaseEvent {
  readonly eventCode: EventCode;

  protected constructor(eventCode: EventCode) {
    this.eventCode = eventCode;
  }
}
