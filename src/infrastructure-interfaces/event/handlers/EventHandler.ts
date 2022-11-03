import { BaseEvent } from '../../../domain/base/BaseEvent';

export interface EventHandler<T extends BaseEvent> {
  handle(event: T): Promise<void>;
}
