import { BaseEvent } from '../../../utils/domain/BaseEvent';
import { BaseInfrastructureError } from '../../errors/BaseInfrastructureError';

export class EventHandlerIsNotDeclaredError extends BaseInfrastructureError {
  constructor(public readonly event: BaseEvent) {
    super();
  }
}
