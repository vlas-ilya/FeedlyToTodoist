import { Error } from '../../../utils/Error';
import { BaseEvent } from '../../../domain/base/BaseEvent';

export class EventHandlerIsNotDeclaredError extends Error {
  constructor(event: BaseEvent) {
    super();
  }
}
