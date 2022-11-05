import { BaseError } from '../../../utils/domain/BaseError';

export class IncorrectTodoistCredentialsError extends BaseError {
  constructor(public readonly userId: string) {
    super();
  }
}
