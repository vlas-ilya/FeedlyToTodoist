import { BaseEntity } from '../base/BaseEntity';
import { UserId } from './UserId';
import { UserInfoWasUpdatedEvent } from './events/UserInfoWasUpdatedEvent';
import { UserInfo } from './UserInfo';
import { ReplayToUserEvent } from './events/ReplayToUserEvent';
import {
  SET_FEEDLY_STREAM_NAME,
  SET_FEEDLY_TOKEN,
  SET_TODOIST_PROJECT_ID,
  SET_TODOIST_TOKEN,
} from '../../utils/commands';
import { Links } from './Links';
import { UserLinksWasUpdatedEvent } from './events/UserLinksWasUpdatedEvent';
import { TransferUserLinksEvent } from './events/TransferUserLinksEvent';
import { Link } from './Link';

export class User extends BaseEntity<UserId> {
  constructor(userId: UserId, private userInfo: UserInfo, private links: Links) {
    super(userId);
  }

  public changeFeedlyToken() {
    this.userInfo.userStatus = 'SET_FEEDLY_TOKEN';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
    this.addEvent(new ReplayToUserEvent(this.id, 'Установите API токен для Feedly'));
  }

  public changeFeedlyStreamName() {
    this.userInfo.userStatus = 'SET_FEEDLY_STREAM_NAME';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
    this.addEvent(new ReplayToUserEvent(this.id, 'Установите stream для Feedly'));
  }

  public changeTodoistToken() {
    this.userInfo.userStatus = 'SET_TODOIST_TOKEN';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
    this.addEvent(new ReplayToUserEvent(this.id, 'Установите API токен для Todoist'));
  }

  public changeTodoistProjectId() {
    this.userInfo.userStatus = 'SET_TODOIST_PROJECT_ID';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
    this.addEvent(new ReplayToUserEvent(this.id, 'Установите ID проекта для Todoist'));
  }

  public setValue(value: string) {
    switch (this.userInfo.userStatus) {
      case 'INIT':
        this.links.addLinks(Link.convertToLinks(value));
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
      emptyFields.push(`Установите API токен для Feedly командой /${SET_FEEDLY_TOKEN}`);
    }
    if (!this.userInfo.feedlyStreamName) {
      emptyFields.push(`Установите stream для Feedly командой /${SET_FEEDLY_STREAM_NAME}`);
    }
    if (!this.userInfo.todoistToken) {
      emptyFields.push(`Установите API токен для Todoist командой /${SET_TODOIST_TOKEN}`);
    }
    if (!this.userInfo.todoistProjectId) {
      emptyFields.push(`Установите ID проекта для Todoist командой /${SET_TODOIST_PROJECT_ID}`);
    }
    if (emptyFields.length > 0) {
      this.addEvent(new ReplayToUserEvent(this.id, emptyFields.join(', ')));
    } else if (this.userInfo.userStatus != 'INIT') {
      emptyFields.push(
        `Теперь вы можете отправлять ссылки в бот и они автоматически по понедельникам будут отправляться вам в Todoist, как и ссылки из Feedly (Read Later)`,
      );
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
