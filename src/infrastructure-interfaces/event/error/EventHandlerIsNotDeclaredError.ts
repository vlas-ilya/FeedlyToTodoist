import { BaseEvent } from '../../../utils/domain/BaseEvent';
import { BaseError } from '../../../utils/domain/BaseError';

export class EventHandlerIsNotDeclaredError extends BaseError {
  constructor(public readonly event: BaseEvent) {
    super();
  }
}
