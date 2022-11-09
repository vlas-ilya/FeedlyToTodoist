import { Context, Entity } from '../utils/context/Context';
import { UserServiceImpl } from '../infrastructure/services/UserServiceImpl';
import { UserRepositoryImpl } from '../repository/UserRepositoryImpl';
import { EventDispatcherImpl } from '../infrastructure/events/EventDispatcherImpl';
import { UserDaoImpl } from '../infrastructure/dao/UserDaoImpl';
import { UserService } from '../infrastructure-interfaces/services/UserService';
import { UserRepository } from '../repository-interfaces/UserRepository';
import { UserDao } from '../infrastructure-interfaces/dao/UserDao';
import { EventDispatcher } from '../infrastructure-interfaces/events/EventDispatcher';
import { LinkDaoImpl } from '../infrastructure/dao/LinkDaoImpl';
import { LinkDao } from '../infrastructure-interfaces/dao/LinkDao';
import { NotesTransferService } from '../infrastructure-interfaces/services/NotesTransferService';
import { NotesTransferServiceImpl } from '../infrastructure/services/NotesTransferServiceImpl';
const { v4: uuidv4 } = require('uuid');
import {
  TelegramApiToken,
  TelegramBotControllerProvider,
  TelegramBotStarter,
  TelegramClient,
  TelegramClientEndpoint,
} from '../utils/telegram/TelegramBotStarter';
import { TelegramController } from './controllers/TelegramController';
import { BaseEvent } from '../utils/domain/BaseEvent';
import { EventHandler } from '../infrastructure-interfaces/events/handlers/EventHandler';
import { Events } from '../constants/events';
import { ReplayToUserEventHandler } from '../infrastructure/events/handlers/ReplayToUserEventHandler';
import { TransferUserLinksEventHandler } from '../infrastructure/events/handlers/TransferUserLinksEventHandler';
import { getOrThrowIfEmpty } from '../utils/errors';
import { EventHandlerIsNotDeclaredError } from '../infrastructure-interfaces/events/error/EventHandlerIsNotDeclaredError';
import { CronJobControllerProvider, CronStarter } from '../utils/cron/CronStarter';
import { CronController } from './controllers/CronController';
import { FeedlyClientImpl } from '../infrastructure/network/FeedlyClientImpl';
import { FeedlyClient } from '../infrastructure-interfaces/network/FeedlyClient';
import { TodoistClient } from '../infrastructure-interfaces/network/TodoistClient';
import { TodoistClientImpl } from '../infrastructure/network/TodoistClientImpl';
import { TitleLoader } from '../infrastructure-interfaces/network/TitleLoader';
import { TitleLoaderImpl } from '../infrastructure/network/TitleLoaderImpl';
import { IdProvider } from '../utils/providers/IdProvider';
import { fetch, Fetch } from '../utils/fetch';
import { DateProvider } from '../utils/providers/DateProvider';
import { RandomProvider } from '../utils/providers/RandomProvider';
import { TransferringStatusDao } from '../infrastructure-interfaces/dao/TransferringStatusDao';
import { TransferringStatusDaoImpl } from '../infrastructure/dao/TransferringStatusDaoImpl';
import { FileStorageProvider } from '../infrastructure-interfaces/storage/FileStorageProvider';
import { FileStorageProviderImpl } from '../infrastructure/storage/FileStorageProviderImpl';

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
    return new TelegramController(this.userService(), this.dateProvider(), this.idProvider());
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
    return new UserRepositoryImpl(this.userDao(), this.linkDao(), this.transferringStatusDao());
  }

  @Entity()
  private userDao(): UserDao {
    return new UserDaoImpl(this.fileStorageProvider());
  }

  @Entity()
  private linkDao(): LinkDao {
    return new LinkDaoImpl(this.fileStorageProvider());
  }

  @Entity()
  private transferringStatusDao(): TransferringStatusDao {
    return new TransferringStatusDaoImpl(this.fileStorageProvider());
  }

  @Entity()
  private fileStorageProvider(): FileStorageProvider {
    return new FileStorageProviderImpl();
  }

  @Entity()
  private eventDispatcher(): EventDispatcher {
    const handlers = {
      ReplayToUserEvent: () => new ReplayToUserEventHandler(this.telegramClient()),
      TransferUserLinksEvent: () => new TransferUserLinksEventHandler(this.userService(), this.notesTransferService()),
    } as {
      [key in Events]: () => EventHandler<any>;
    };

    const eventHandlerProvider = <E extends BaseEvent>(event: E) =>
      getOrThrowIfEmpty(handlers[event.eventCode], new EventHandlerIsNotDeclaredError(event))();

    return new EventDispatcherImpl(eventHandlerProvider);
  }

  @Entity()
  private notesTransferService(): NotesTransferService {
    return new NotesTransferServiceImpl(
      this.userService(),
      this.feedlyClient(),
      this.todoistClient(),
      this.titleLoader(),
      this.idProvider(),
    );
  }

  @Entity()
  private feedlyClient(): FeedlyClient {
    return new FeedlyClientImpl(this.fetch());
  }

  @Entity()
  private todoistClient(): TodoistClient {
    return new TodoistClientImpl(this.idProvider(), this.dateProvider(), this.fetch());
  }

  @Entity()
  private titleLoader(): TitleLoader {
    return new TitleLoaderImpl(this.fetch());
  }

  @Entity()
  private idProvider(): IdProvider {
    return {
      generate(): string {
        return uuidv4();
      },
    };
  }

  @Entity()
  private dateProvider(): DateProvider {
    return {
      generate(): Date {
        return new Date();
      },
    };
  }

  @Entity()
  private randomProvider(): RandomProvider {
    return {
      shuffle<T>(list: T[]) {
        list.sort(() => Math.random() - 0.5);
      },
    };
  }

  @Entity()
  private fetch(): Fetch {
    return fetch;
  }
}
