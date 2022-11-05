import { BaseValueObject } from './BaseValueObject';

export class BaseId extends BaseValueObject {
  constructor(public readonly value: string) {
    super();
  }

  equals(object: BaseValueObject): boolean {
    if (!object) {
      return false;
    }
    if (object! instanceof BaseId) {
      return false;
    }
    const id = object as BaseId;
    return this.value == id.value;
  }
}
