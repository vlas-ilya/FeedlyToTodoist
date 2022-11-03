import { EventDispatcher } from '../../infrastructure-interfaces/event/EventDispatcher';
import { EventHandlerProvider } from '../../infrastructure-interfaces/event/EventHandlerProvider';
import { BaseEvent } from '../../domain/base/BaseEvent';

export class EventDispatcherImpl implements EventDispatcher {
  constructor(private readonly eventHandlerProvider: EventHandlerProvider) {}

  async dispatch<T extends BaseEvent>(...events: T[]): Promise<void> {
    await Promise.all(events.map((event) => this.eventHandlerProvider.get(event).handle(event)));
  }
}
