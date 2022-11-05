import { BaseError } from '../../../utils/domain/BaseError';

export class IncorrectFeedlyCredentialsError extends BaseError {
  constructor(public readonly userId: string) {
    super();
  }
}
