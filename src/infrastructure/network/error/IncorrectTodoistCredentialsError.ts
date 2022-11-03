import { BaseError } from '../../../domain/base/BaseError';

export class IncorrectTodoistCredentialsError extends BaseError {
  constructor(public readonly userId: string) {
    super();
  }
}
