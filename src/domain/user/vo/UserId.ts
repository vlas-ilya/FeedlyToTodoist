import { BaseId } from '../../../utils/domain/BaseId';
import { BaseValueObject } from '../../../utils/domain/BaseValueObject';

export class UserId extends BaseId {
  clone() {
    return new UserId(this.value);
  }
}
