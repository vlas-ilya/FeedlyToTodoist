import { BaseEvent } from '../../domain/base/BaseEvent';

export interface EventDispatcher {
  dispatch(...events: BaseEvent[]): Promise<void>;
}
