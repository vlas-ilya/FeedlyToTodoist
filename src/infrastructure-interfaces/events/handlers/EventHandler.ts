import { BaseEvent } from '../../../utils/domain/BaseEvent';

export interface EventHandler<T extends BaseEvent> {
  handle(event: T): Promise<void>;
}
