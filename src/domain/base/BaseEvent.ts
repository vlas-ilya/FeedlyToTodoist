export abstract class BaseEvent {
  readonly eventCode: EventCode;

  protected constructor(eventCode: EventCode) {
    this.eventCode = eventCode;
  }
}

export type EventCode =
  | 'UserInfoWasUpdatedEvent'
  | 'ReplayToUserEvent'
  | 'UserLinksWasUpdatedEvent'
  | 'TransferUserLinksEvent';
