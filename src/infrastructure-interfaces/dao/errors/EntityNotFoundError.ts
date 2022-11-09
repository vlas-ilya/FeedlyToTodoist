import { BaseInfrastructureError } from '../../errors/BaseInfrastructureError';

export class EntityNotFoundError extends BaseInfrastructureError {
  constructor(public readonly id: string) {
    super();
  }
}
