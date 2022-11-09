import { Events } from '../../constants/events';

export abstract class BaseEvent {
  readonly eventCode: Events;

  protected constructor(eventCode: Events) {
    this.eventCode = eventCode;
  }
}
