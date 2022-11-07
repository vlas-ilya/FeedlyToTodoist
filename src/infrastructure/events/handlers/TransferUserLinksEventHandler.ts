import { EventHandler } from '../../../infrastructure-interfaces/events/handlers/EventHandler';
import { TransferUserLinksEvent } from '../../../domain/user/events/TransferUserLinksEvent';
import { NotesTransferService } from '../../../infrastructure-interfaces/services/NotesTransferService';
import { IncorrectFeedlyCredentialsError } from '../../../infrastructure-interfaces/network/error/IncorrectFeedlyCredentialsError';
import { IncorrectTodoistCredentialsError } from '../../../infrastructure-interfaces/network/error/IncorrectTodoistCredentialsError';
import { UnknownError } from '../../../infrastructure-interfaces/network/error/UnknownError';
import { TelegramClient } from '../../../utils/telegram/TelegramBotStarter';
import { UserService } from '../../../infrastructure-interfaces/services/UserService';

export class TransferUserLinksEventHandler implements EventHandler<TransferUserLinksEvent> {
  constructor(
    private readonly userService: UserService,
    private readonly notesTransferService: NotesTransferService,
    private readonly telegramClient: TelegramClient,
  ) {}

  async handle(event: TransferUserLinksEvent) {
    try {
      const addedLinks = await this.notesTransferService.transfer(event.userId.value, event.userInfo, event.links);
      await this.userService.run(event.userId.value, async (user) => user.wasTransferringAttempt('NO_ERROR', addedLinks));
    } catch (e) {
      if (e instanceof IncorrectFeedlyCredentialsError) {
        await this.userService.run(event.userId.value, async (user) =>
          user.wasTransferringAttempt('INCORRECT_FEEDLY_CREDENTIALS'),
        );
      } else if (e instanceof IncorrectTodoistCredentialsError) {
        await this.userService.run(event.userId.value, async (user) =>
          user.wasTransferringAttempt('INCORRECT_TODOIST_CREDENTIALS'),
        );
      } else if (e instanceof UnknownError) {
        await this.userService.run(event.userId.value, async (user) => user.wasTransferringAttempt('UNKNOWN_ERROR'));
      }
    }
  }
}
