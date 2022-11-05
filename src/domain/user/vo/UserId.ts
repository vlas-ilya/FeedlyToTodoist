import { BaseId } from '../../../utils/domain/BaseId';
import { BaseValueObject } from '../../../utils/domain/BaseValueObject';

export class UserId extends BaseId {
  equals(object: BaseValueObject): boolean {
    return super.equals(object) && object instanceof UserId;
  }

  clone() {
    return new UserId(this.value);
  }
}
