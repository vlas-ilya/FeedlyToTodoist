import { BaseId } from './BaseId';
import { BaseEvent } from './BaseEvent';

export abstract class BaseEntity<ID extends BaseId, DATA> {
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

  equals(entityOrId: BaseEntity<ID, DATA> | ID): boolean {
    if (!entityOrId) {
      return false;
    }
    if ('id' in entityOrId) {
      return this.id && this.id.equals(entityOrId.id as ID);
    }
    return this.id && this.id.equals(entityOrId);
  }

  abstract save(delegate: SaveChangesDelegate<DATA>): Promise<void>;
}

export type SaveChangesDelegate<CHANGES> = (...data: CHANGES[]) => Promise<void>;
