import { BaseEvent } from '../../utils/domain/BaseEvent';

export interface EventDispatcher {
  dispatch(...events: BaseEvent[]): Promise<void>;
}
