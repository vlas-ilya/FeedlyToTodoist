import { BaseError } from '../../../domain/base/BaseError';

export class UnknownError extends BaseError {
  constructor(public readonly userId: string) {
    super();
  }
}
