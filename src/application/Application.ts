import { Context, Entity } from '../utils/context/Context';
import { UserServiceImpl } from '../infrastructure/service/UserServiceImpl';
import { UserRepositoryImpl } from '../repository/UserRepositoryImpl';
import { EventDispatcherImpl } from '../infrastructure/event/EventDispatcherImpl';
import { UserDaoImpl } from '../infrastructure/dao/UserDaoImpl';
import { UserService } from '../infrastructure-interfaces/service/UserService';
import { UserRepository } from '../repository-interfaces/UserRepository';
import { UserDao } from '../infrastructure-interfaces/dao/UserDao';
import { EventDispatcher } from '../infrastructure-interfaces/event/EventDispatcher';
import { LinkDaoImpl } from '../infrastructure/dao/LinkDaoImpl';
import { LinkDao } from '../infrastructure-interfaces/dao/LinkDao';
import { NotesTransferService } from '../infrastructure-interfaces/network/NotesTransferService';
import { NotesTransferServiceImpl } from '../infrastructure/network/NotesTransferServiceImpl';
import {
  TelegramApiToken,
  TelegramBotControllerProvider,
  TelegramBotStarter,
  TelegramClient,
  TelegramClientEndpoint,
} from '../utils/telegram/TelegramBotStarter';
import { TelegramController } from './controllers/TelegramController';
import { BaseEvent } from '../utils/domain/BaseEvent';
import { EventHandler } from '../infrastructure-interfaces/event/handlers/EventHandler';
import { EventCode } from '../constants/EventCode';
import { UserInfoWasUpdatedEventHandler } from '../infrastructure/event/handlers/UserInfoWasUpdatedEventHandler';
import { ReplayToUserEventHandler } from '../infrastructure/event/handlers/ReplayToUserEventHandler';
import { UserLinksWasUpdatedEventHandler } from '../infrastructure/event/handlers/UserLinksWasUpdatedEventHandler';
import { TransferUserLinksEventHandler } from '../infrastructure/event/handlers/TransferUserLinksEventHandler';
import { getOrThrowIfEmpty } from '../utils/errors';
import { EventHandlerIsNotDeclaredError } from '../infrastructure-interfaces/event/error/EventHandlerIsNotDeclaredError';
import { CronJobControllerProvider, CronStarter } from '../utils/cron/CronStarter';
import { CronController } from './controllers/CronController';

@Context()
@TelegramBotStarter()
@CronStarter()
export class Application {
  @Entity()
  @TelegramApiToken()
  public telegramApiKey(): string {
    return process.env.telegramApiToken!;
  }

  @Entity()
  @TelegramBotControllerProvider()
  public telegramController(): TelegramController {
    return new TelegramController(this.userService());
  }

  @Entity()
  @TelegramClientEndpoint()
  public telegramClient(): TelegramClient {
    return null!;
  }

  @Entity()
  @CronJobControllerProvider()
  public cronController(): CronController {
    return new CronController(this.userService());
  }

  @Entity()
  private userService(): UserService {
    return new UserServiceImpl(this.userRepository(), this.eventDispatcher());
  }

  @Entity()
  private userRepository(): UserRepository {
    return new UserRepositoryImpl(this.userDao(), this.linkDao());
  }

  @Entity()
  private userDao(): UserDao {
    return new UserDaoImpl();
  }

  @Entity()
  private linkDao(): LinkDao {
    return new LinkDaoImpl();
  }

  @Entity()
  private eventDispatcher(): EventDispatcher {
    const handlers = {
      UserInfoWasUpdatedEvent: () => new UserInfoWasUpdatedEventHandler(this.userDao()),
      ReplayToUserEvent: () => new ReplayToUserEventHandler(this.telegramClient()),
      UserLinksWasUpdatedEvent: () => new UserLinksWasUpdatedEventHandler(this.linkDao()),
      TransferUserLinksEvent: () =>
        new TransferUserLinksEventHandler(this.notesTransferService(), this.telegramClient()),
    } as {
      [key in EventCode]: () => EventHandler<any>;
    };

    const eventHandlerProvider = <E extends BaseEvent>(event: E) =>
      getOrThrowIfEmpty(handlers[event.eventCode], new EventHandlerIsNotDeclaredError(event))();

    return new EventDispatcherImpl(eventHandlerProvider);
  }

  @Entity()
  private notesTransferService(): NotesTransferService {
    return new NotesTransferServiceImpl(this.userService());
  }
}
