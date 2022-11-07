import { BaseValueObject } from './BaseValueObject';

export class BaseId extends BaseValueObject {
  constructor(public readonly value: string) {
    super();
  }
}
