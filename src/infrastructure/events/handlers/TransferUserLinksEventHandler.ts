import { EventHandler } from '../../../infrastructure-interfaces/events/handlers/EventHandler';
import { TransferUserLinksEvent } from '../../../domain/user/events/TransferUserLinksEvent';
import { NotesTransferService } from '../../../infrastructure-interfaces/services/NotesTransferService';
import { IncorrectFeedlyCredentialsError } from '../../../infrastructure-interfaces/network/error/IncorrectFeedlyCredentialsError';
import { IncorrectTodoistCredentialsError } from '../../../infrastructure-interfaces/network/error/IncorrectTodoistCredentialsError';
import { UnknownError } from '../../../infrastructure-interfaces/network/error/UnknownError';
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
    try {
      await this.notesTransferService.transfer(event.userId.value, event.userInfo, event.links);
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
