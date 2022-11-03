import { BaseValueObject } from './BaseValueObject';

export class Id extends BaseValueObject {
  constructor(public readonly value: string) {
    super();
  }

  equals(object: BaseValueObject): boolean {
    if (!object) {
      return false;
    }
    if (object! instanceof Id) {
      return false;
    }
    const id = object as Id;
    return this.value == id.value;
  }
}
