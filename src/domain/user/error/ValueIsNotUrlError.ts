import { BaseError } from '../../../utils/domain/BaseError';

export class ValueIsNotUrlError extends BaseError {
  constructor(public readonly value: string) {
    super();
  }
}
