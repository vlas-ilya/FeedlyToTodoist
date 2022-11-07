import { BaseValueObject } from '../../../utils/domain/BaseValueObject';
import { UserStatus } from './UserStatus';
import { Maybe } from '../../../utils/types/Maybe';

export class UserInfo extends BaseValueObject {
  constructor(
    public feedlyStreamName: Maybe<string>,
    public feedlyToken: Maybe<string>,
    public todoistToken: Maybe<string>,
    public todoistProjectId: Maybe<string>,
    public dailyPlan: Maybe<number>,
    public userStatus: Maybe<UserStatus>,
  ) {
    super();
  }

  static empty(): UserInfo {
    return new UserInfo(undefined, undefined, undefined, undefined, undefined, 'INIT');
  }
}
