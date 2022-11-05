import { Id } from './Id';
import { BaseEvent } from './BaseEvent';

export abstract class BaseEntity<ID extends Id> {
  private _events: BaseEvent[] = [];

  protected constructor(public readonly id: ID) {}

  protected addEvent(event: BaseEvent) {
    this._events.push(event);
  }

  public events(): BaseEvent[] {
    let result = [...this._events];
    this._events = [];
    return result;
  }

  equals(entityOrId: BaseEntity<ID> | ID): boolean {
    if (!entityOrId) {
      return false;
    }
    if ('id' in entityOrId) {
      return this.id && this.id.equals(entityOrId.id as ID);
    }
    return this.id && this.id.equals(entityOrId);
  }
}
