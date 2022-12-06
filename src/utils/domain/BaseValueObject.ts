export abstract class BaseValueObject {
  public equals(object: BaseValueObject): boolean {
    if (!object) {
      return false;
    }

    if (!(this instanceof object.constructor)) {
      return false;
    }

    return Object.keys(this).every((key) => {
      if (!(key in object)) {
        return false;
      }

      const [thisValue, objectValue] = this.getValues(this, object, key);

      if (Array.isArray(thisValue) && Array.isArray(objectValue)) {
        return this.arrayEquals(thisValue, objectValue);
      }

      if (this.hasEqualMethod(thisValue) && this.hasEqualMethod(objectValue)) {
        return thisValue.equals(objectValue);
      }

      if (thisValue instanceof Date && objectValue instanceof Date) {
        return thisValue.getTime() === objectValue.getTime();
      }

      return thisValue == objectValue;
    });
  }

  private getValues(object1: BaseValueObject, object2: BaseValueObject, key: string) {
    const thisObject = object1 as { [key: string]: any };
    const objectObject = object2 as { [key: string]: any };
    return [thisObject[key], objectObject[key]];
  }

  private arrayEquals(a: any[], b: any[]): boolean {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => {
        if (this.hasEqualMethod(val) && this.hasEqualMethod(b[index])) {
          return val.equals(b[index]);
        }
        return val === b[index];
      })
    );
  }

  private hasEqualMethod(object: BaseValueObject): boolean {
    return typeof object == 'object' && 'equals' in object && typeof object['equals'] == 'function';
  }
}
