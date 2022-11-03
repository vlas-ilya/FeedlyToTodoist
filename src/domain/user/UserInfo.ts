import { BaseValueObject } from '../base/BaseValueObject';
import { UserStatus } from './UserStatus';

export class UserInfo extends BaseValueObject {
  constructor(
    public feedlyStreamName?: string,
    public feedlyToken?: string,
    public todoistToken?: string,
    public todoistProjectId?: string,
    public userStatus: UserStatus = 'INIT',
  ) {
    super();
  }

  equals(object: BaseValueObject) {
    if (!object) {
      return false;
    }
    if (object! instanceof UserInfo) {
      return false;
    }
    const userIndo = object as UserInfo;
    return (
      this.feedlyStreamName == userIndo.feedlyStreamName &&
      this.feedlyToken == userIndo.feedlyToken &&
      this.todoistToken == userIndo.todoistToken &&
      this.todoistProjectId == userIndo.todoistProjectId &&
      this.userStatus == userIndo.userStatus
    );
  }
}
