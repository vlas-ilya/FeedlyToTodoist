import { BaseEntity } from '../../utils/domain/BaseEntity';
import { UserId } from './vo/UserId';
import { UserInfoWasUpdatedEvent } from './events/UserInfoWasUpdatedEvent';
import { UserInfo } from './vo/UserInfo';
import { ReplayToUserEvent } from './events/ReplayToUserEvent';
import { Links } from './vo/Links';
import { UserLinksWasUpdatedEvent } from './events/UserLinksWasUpdatedEvent';
import { TransferUserLinksEvent } from './events/TransferUserLinksEvent';
import { Link } from './vo/Link';
import {
  SET_FEEDLY_STREAM_NAME_BY_COMMAND_RESPONSE,
  SET_FEEDLY_STREAM_NAME_RESPONSE,
  SET_FEEDLY_TOKEN_BY_COMMAND_RESPONSE,
  SET_FEEDLY_TOKEN_RESPONSE,
  SET_TODOIST_PROJECT_ID_BY_COMMAND_RESPONSE,
  SET_TODOIST_PROJECT_ID_RESPONSE,
  SET_TODOIST_TOKEN_BY_COMMAND_RESPONSE,
  SET_TODOIST_TOKEN_RESPONSE,
  YOU_CAN_START_RESPONSE,
} from '../../constants/responses';
import { DateProvider } from '../../utils/providers/DateProvider';

export class User extends BaseEntity<UserId> {
  constructor(userId: UserId, private userInfo: UserInfo, private links: Links) {
    super(userId);
  }

  public changeFeedlyToken() {
    this.userInfo.userStatus = 'SET_FEEDLY_TOKEN';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
    this.addEvent(new ReplayToUserEvent(this.id, SET_FEEDLY_TOKEN_RESPONSE));
  }

  public changeFeedlyStreamName() {
    this.userInfo.userStatus = 'SET_FEEDLY_STREAM_NAME';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
    this.addEvent(new ReplayToUserEvent(this.id, SET_FEEDLY_STREAM_NAME_RESPONSE));
  }

  public changeTodoistToken() {
    this.userInfo.userStatus = 'SET_TODOIST_TOKEN';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
    this.addEvent(new ReplayToUserEvent(this.id, SET_TODOIST_TOKEN_RESPONSE));
  }

  public changeTodoistProjectId() {
    this.userInfo.userStatus = 'SET_TODOIST_PROJECT_ID';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
    this.addEvent(new ReplayToUserEvent(this.id, SET_TODOIST_PROJECT_ID_RESPONSE));
  }

  public setValue(value: string, dateGenerator: DateProvider) {
    switch (this.userInfo.userStatus) {
      case 'INIT':
        this.links.addLinks(Link.convertToLinks(value, dateGenerator));
        this.addEvent(new UserLinksWasUpdatedEvent(this.id, this.links));
        break;
      case 'SET_FEEDLY_TOKEN':
        this.userInfo.feedlyToken = value;
        break;
      case 'SET_FEEDLY_STREAM_NAME':
        this.userInfo.feedlyStreamName = value;
        break;
      case 'SET_TODOIST_PROJECT_ID':
        this.userInfo.todoistProjectId = value;
        break;
      case 'SET_TODOIST_TOKEN':
        this.userInfo.todoistToken = value;
        break;
    }
    this.checkConfigFields();
    this.userInfo.userStatus = 'INIT';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
  }

  private checkConfigFields() {
    const emptyFields = [];
    if (!this.userInfo.feedlyToken) {
      emptyFields.push(SET_FEEDLY_TOKEN_BY_COMMAND_RESPONSE);
    }
    if (!this.userInfo.feedlyStreamName) {
      emptyFields.push(SET_FEEDLY_STREAM_NAME_BY_COMMAND_RESPONSE);
    }
    if (!this.userInfo.todoistToken) {
      emptyFields.push(SET_TODOIST_TOKEN_BY_COMMAND_RESPONSE);
    }
    if (!this.userInfo.todoistProjectId) {
      emptyFields.push(SET_TODOIST_PROJECT_ID_BY_COMMAND_RESPONSE);
    }
    if (emptyFields.length > 0) {
      this.addEvent(new ReplayToUserEvent(this.id, emptyFields.join(', ')));
    } else if (this.userInfo.userStatus != 'INIT') {
      emptyFields.push(YOU_CAN_START_RESPONSE);
      this.addEvent(new ReplayToUserEvent(this.id, emptyFields.join(', ')));
    }
  }

  create() {
    this.checkConfigFields();
  }

  transferLinks() {
    this.addEvent(new TransferUserLinksEvent(this.id, this.userInfo, this.links));
  }

  removeLinks(links: Link[]) {
    this.links = this.links.removeLinks(links);
    this.addEvent(new UserLinksWasUpdatedEvent(this.id, this.links));
  }
}
