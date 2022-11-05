import { UserStatus } from '../../../domain/user/vo/UserStatus';
import { UserInfo } from '../../../domain/user/vo/UserInfo';

export class UserDto {
  feedlyStreamName?: string;
  feedlyToken?: string;
  todoistToken?: string;
  todoistProjectId?: string;
  userStatus?: string;

  static fromEntity(userInfo: UserInfo): UserDto {
    const userDto = new UserDto();
    userDto.feedlyStreamName = userInfo.feedlyStreamName;
    userDto.feedlyToken = userInfo.feedlyToken;
    userDto.todoistToken = userInfo.todoistToken;
    userDto.todoistProjectId = userInfo.todoistProjectId;
    userDto.userStatus = userInfo.userStatus;
    return userDto;
  }

  toEntity(): UserInfo {
    return new UserInfo(
      this.feedlyStreamName,
      this.feedlyToken,
      this.todoistToken,
      this.todoistProjectId,
      UserDto.toUserStatus(this.userStatus),
    )
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
      case 'INIT':
      default:
        return 'INIT';
    }
  }
}
