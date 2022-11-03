import { EventHandlerProvider } from '../../infrastructure-interfaces/event/EventHandlerProvider';
import { EventHandler } from '../../infrastructure-interfaces/event/handlers/EventHandler';
import { BaseEvent, EventCode } from '../../domain/base/BaseEvent';
import { UserInfoWasUpdatedEventHandler } from './handlers/UserInfoWasUpdatedEventHandler';
import { EventHandlerIsNotDeclaredError } from '../../infrastructure-interfaces/event/error/EventHandlerIsNotDeclaredError';
import { getOrThrowIfEmpty } from '../../utils/errors';
import { UserDao } from '../../infrastructure-interfaces/dao/UserDao';
import { ReplayToUserEventHandler } from './handlers/ReplayToUserEventHandler';
import { TelegramClient } from '../../infrastructure-interfaces/network/TelegramClient';
import { UserLinksWasUpdatedEventHandler } from './handlers/UserLinksWasUpdatedEventHandler';
import { LinkDao } from '../../infrastructure-interfaces/dao/LinkDao';
import { TransferUserLinksEventHandler } from './handlers/TransferUserLinksEventHandler';
import { NotesTransferService } from '../../infrastructure-interfaces/network/NotesTransferService';

export class EventHandlerProviderImpl implements EventHandlerProvider {
  constructor(
    private readonly userDao: () => UserDao,
    private readonly linkDao: () => LinkDao,
    private readonly notesTransferService: () => NotesTransferService,
    private readonly telegramClient: () => TelegramClient,
  ) {}

  private readonly handlers: {
    [key in EventCode]: () => EventHandler<any>;
  } = {
    UserInfoWasUpdatedEvent: () => new UserInfoWasUpdatedEventHandler(this.userDao()),
    ReplayToUserEvent: () => new ReplayToUserEventHandler(this.telegramClient()),
    UserLinksWasUpdatedEvent: () => new UserLinksWasUpdatedEventHandler(this.linkDao()),
    TransferUserLinksEvent: () => new TransferUserLinksEventHandler(this.notesTransferService(), this.telegramClient()),
  };

  get<E extends BaseEvent>(event: E): EventHandler<E> {
    const generateHandler = getOrThrowIfEmpty(
      this.handlers[event.eventCode],
      new EventHandlerIsNotDeclaredError(event),
    );
    // @ts-ignore
    return generateHandler();
  }
}
