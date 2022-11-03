import { BaseError } from '../../base/BaseError';

export class ValueIsNotUrlError extends BaseError {
  constructor(public readonly value: string) {
    super();
  }
}
