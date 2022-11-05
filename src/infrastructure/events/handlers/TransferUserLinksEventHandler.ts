import { EventHandler } from '../../../infrastructure-interfaces/events/handlers/EventHandler';
import { TransferUserLinksEvent } from '../../../domain/user/events/TransferUserLinksEvent';
import { NotesTransferService } from '../../../infrastructure-interfaces/network/NotesTransferService';
import { IncorrectFeedlyCredentialsError } from '../../network/error/IncorrectFeedlyCredentialsError';
import { IncorrectTodoistCredentialsError } from '../../network/error/IncorrectTodoistCredentialsError';
import { UnknownError } from '../../network/error/UnknownError';
import { TelegramClient } from '../../../utils/telegram/TelegramBotStarter';
import {
  INCORRECT_FEEDLY_CREDENTIALS,
  INCORRECT_TODOIST_CREDENTIALS,
  UNKNOWN_ERROR,
} from '../../../constants/responses';

export class TransferUserLinksEventHandler implements EventHandler<TransferUserLinksEvent> {
  constructor(
    private readonly notesTransferService: NotesTransferService,
    private readonly telegramClient: TelegramClient,
  ) {}

  async handle(event: TransferUserLinksEvent) {
    if (
      !event.userInfo.feedlyStreamName ||
      !event.userInfo.feedlyToken ||
      !event.userInfo.todoistToken ||
      !event.userInfo.todoistProjectId
    ) {
      return;
    }

    try {
      await this.notesTransferService.transfer(
        event.userId.value,
        event.userInfo.feedlyStreamName,
        event.userInfo.feedlyToken,
        event.userInfo.todoistToken,
        event.userInfo.todoistProjectId,
        event.links.links,
      );
    } catch (e) {
      if (e instanceof IncorrectFeedlyCredentialsError) {
        await this.telegramClient.send(e.userId, INCORRECT_FEEDLY_CREDENTIALS);
      } else if (e instanceof IncorrectTodoistCredentialsError) {
        await this.telegramClient.send(e.userId, INCORRECT_TODOIST_CREDENTIALS);
      } else if (e instanceof UnknownError) {
        await this.telegramClient.send(e.userId, UNKNOWN_ERROR);
      }
    }
  }
}
