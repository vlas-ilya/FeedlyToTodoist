import { BaseError } from '../../../utils/domain/BaseError';

export class UnknownError extends BaseError {
  constructor(public readonly userId: string) {
    super();
  }
}
