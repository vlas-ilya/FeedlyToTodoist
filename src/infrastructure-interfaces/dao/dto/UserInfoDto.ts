import { UserStatus } from '../../../domain/user/vo/UserStatus';
import { UserInfo } from '../../../domain/user/vo/UserInfo';

export class UserInfoDto {
  feedlyStreamName?: string;
  feedlyToken?: string;
  todoistToken?: string;
  todoistProjectId?: string;
  userStatus?: string;
  dailyPlan?: number;

  static fromEntity(userInfo: UserInfo): UserInfoDto {
    const userDto = new UserInfoDto();
    userDto.feedlyStreamName = userInfo.feedlyStreamName;
    userDto.feedlyToken = userInfo.feedlyToken;
    userDto.todoistToken = userInfo.todoistToken;
    userDto.todoistProjectId = userInfo.todoistProjectId;
    userDto.userStatus = userInfo.userStatus;
    userDto.dailyPlan = userInfo.dailyPlan;
    return userDto;
  }

  toEntity(): UserInfo {
    return new UserInfo(
      this.feedlyStreamName,
      this.feedlyToken,
      this.todoistToken,
      this.todoistProjectId,
      this.dailyPlan,
      UserInfoDto.toUserStatus(this.userStatus),
    );
  }

  static toUserStatus(userStatus?: string): UserStatus {
    switch (userStatus) {
      case 'SET_FEEDLY_TOKEN':
        return 'SET_FEEDLY_TOKEN';
      case 'SET_FEEDLY_STREAM_NAME':
        return 'SET_FEEDLY_STREAM_NAME';
      case 'SET_TODOIST_TOKEN':
        return 'SET_TODOIST_TOKEN';
      case 'SET_TODOIST_PROJECT_ID':
        return 'SET_TODOIST_PROJECT_ID';
      case 'SET_DAILY_PLAN':
        return 'SET_DAILY_PLAN';
      case 'INIT':
      default:
        return 'INIT';
    }
  }
}
