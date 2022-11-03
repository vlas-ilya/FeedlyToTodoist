import { EventHandler } from './handlers/EventHandler';
import { BaseEvent } from '../../domain/base/BaseEvent';

export interface EventHandlerProvider {
  get<E extends BaseEvent>(event: E): EventHandler<E>;
}
