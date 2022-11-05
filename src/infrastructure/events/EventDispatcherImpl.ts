import { EventDispatcher } from '../../infrastructure-interfaces/events/EventDispatcher';
import { BaseEvent } from '../../utils/domain/BaseEvent';
import { EventHandler } from '../../infrastructure-interfaces/events/handlers/EventHandler';

export class EventDispatcherImpl implements EventDispatcher {
  constructor(private readonly eventHandlerProvider: <E extends BaseEvent>(event: E) => EventHandler<E>) {}

  async dispatch<T extends BaseEvent>(...events: T[]): Promise<void> {
    await Promise.all(events.map((event) => this.eventHandlerProvider(event).handle(event)));
  }
}
