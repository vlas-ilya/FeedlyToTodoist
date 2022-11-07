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
  DONT_TRANSFERRED_LINKS_COUNT,
  INCORRECT_FEEDLY_CREDENTIALS,
  INCORRECT_TODOIST_CREDENTIALS,
  LAST_TRANSFER_WAS_NOT_SUCCESS,
  LAST_TRANSFER_WAS_SUCCESS,
  SET_DAILY_PLAN,
  SET_FEEDLY_STREAM_NAME_BY_COMMAND_RESPONSE,
  SET_FEEDLY_STREAM_NAME_RESPONSE,
  SET_FEEDLY_TOKEN_BY_COMMAND_RESPONSE,
  SET_FEEDLY_TOKEN_RESPONSE,
  SET_TODOIST_PROJECT_ID_BY_COMMAND_RESPONSE,
  SET_TODOIST_PROJECT_ID_RESPONSE,
  SET_TODOIST_TOKEN_BY_COMMAND_RESPONSE,
  SET_TODOIST_TOKEN_RESPONSE,
  THERE_WAS_NO_TRANSFER,
  UNKNOWN_ERROR,
  YOU_CAN_START_RESPONSE,
} from '../../constants/responses';
import { DateProvider } from '../../utils/providers/DateProvider';
import { DEFAULT_DAILY_PLAN } from '../../constants/common';
import { TransferringStatus, TransferringStatusError } from './vo/TransferringStatus';
import { TransferringStatusWasUpdatedEvent } from './events/TransferringStatusWasUpdatedEvent';

export class User extends BaseEntity<UserId> {
  constructor(
    userId: UserId,
    private userInfo: UserInfo,
    private links: Links,
    private transferringStatus: TransferringStatus,
  ) {
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

  setDailyPlan() {
    this.userInfo.userStatus = 'SET_DAILY_PLAN';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
    this.addEvent(new ReplayToUserEvent(this.id, SET_DAILY_PLAN));
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
      case 'SET_DAILY_PLAN':
        this.userInfo.dailyPlan = parseInt(value) || DEFAULT_DAILY_PLAN;
        break;
    }
    this.checkConfigFields();
    this.userInfo.userStatus = 'INIT';
    this.addEvent(new UserInfoWasUpdatedEvent(this.id, this.userInfo));
  }

  private checkConfigFields() {
    const emptyFields = this.getEmptyFields();
    if (emptyFields.length > 0) {
      this.addEvent(new ReplayToUserEvent(this.id, emptyFields.join(', ')));
    } else if (this.userInfo.userStatus != 'INIT') {
      emptyFields.push(YOU_CAN_START_RESPONSE);
      this.addEvent(new ReplayToUserEvent(this.id, emptyFields.join(', ')));
    }
  }

  private getEmptyFields(): string[] {
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
    return emptyFields;
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

  showStatus() {
    this.addEvent(new ReplayToUserEvent(this.id, this.generateStatusMessage()));
  }

  private generateStatusMessage() {
    const emptyFields = this.getEmptyFields();
    const unprocessedLinks = this.links.links;
    const transferringStatus = this.transferringStatus;

    const message = [];

    if (emptyFields.length > 0) {
      message.push(emptyFields.join(', '));
    }

    message.push(DONT_TRANSFERRED_LINKS_COUNT.replace('count', `${unprocessedLinks.length}`));

    switch (transferringStatus.status) {
      case 'DONT_RUN':
        message.push(THERE_WAS_NO_TRANSFER);
        break;
      case 'RUN_SUCCESSFULLY':
        message.push(LAST_TRANSFER_WAS_SUCCESS);
        break;
      case 'RUN_UNSUCCESSFULLY':
        message.push(LAST_TRANSFER_WAS_NOT_SUCCESS);
        break;
    }

    if (transferringStatus.status != 'RUN_UNSUCCESSFULLY') {
      switch (transferringStatus.error) {
        case 'INCORRECT_FEEDLY_CREDENTIALS':
          message.push(INCORRECT_FEEDLY_CREDENTIALS);
          break;
        case 'INCORRECT_TODOIST_CREDENTIALS':
          message.push(INCORRECT_TODOIST_CREDENTIALS);
          break;
        case 'UNKNOWN_ERROR':
          message.push(UNKNOWN_ERROR);
          break;
      }
    }

    return message.join('\n\n==============\n\n');
  }

  wasTransferringAttempt(error: TransferringStatusError, addedLinks?: Links) {
    if (error == 'NO_ERROR' && addedLinks && addedLinks.links.length > 0) {
      this.removeLinks(addedLinks.links);
    }

    this.transferringStatus =
      error == 'NO_ERROR'
        ? new TransferringStatus('RUN_SUCCESSFULLY', 'NO_ERROR')
        : new TransferringStatus('RUN_UNSUCCESSFULLY', error);

    this.addEvent(new TransferringStatusWasUpdatedEvent(this.id, this.transferringStatus));
  }
}
