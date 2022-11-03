import { BaseError } from '../../../domain/base/BaseError';

export class IncorrectFeedlyCredentialsError extends BaseError {
  constructor(public readonly userId: string) {
    super();
  }
}
