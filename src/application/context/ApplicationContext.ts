import { TelegramBotImpl } from '../telegram/TelegramBotImpl';
import { Entity } from '../../utils/context';
import { UserServiceImpl } from '../../infrastructure/service/UserServiceImpl';
import { UserRepositoryImpl } from '../../repository/UserRepositoryImpl';
import { EventDispatcherImpl } from '../../infrastructure/event/EventDispatcherImpl';
import { UserDaoImpl } from '../../infrastructure/dao/UserDaoImpl';
import { EventHandlerProviderImpl } from '../../infrastructure/event/EventHandlerProviderImpl';
import { UserService } from '../../infrastructure-interfaces/service/UserService';
import { UserRepository } from '../../repository-interfaces/UserRepository';
import { UserDao } from '../../infrastructure-interfaces/dao/UserDao';
import { EventDispatcher } from '../../infrastructure-interfaces/event/EventDispatcher';
import { EventHandlerProvider } from '../../infrastructure-interfaces/event/EventHandlerProvider';
import { LinkDaoImpl } from '../../infrastructure/dao/LinkDaoImpl';
import { LinkDao } from '../../infrastructure-interfaces/dao/LinkDao';
import { FeedlyToTodoistWorkerImpl } from '../../infrastructure/cron/FeedlyToTodoistWorkerImpl';
import { FeedlyToTodoistWorker } from '../../infrastructure-interfaces/cron/FeedlyToTodoistWorker';
import { NotesTransferService } from '../../infrastructure-interfaces/network/NotesTransferService';
import { NotesTransferServiceImpl } from '../../infrastructure/network/NotesTransferServiceImpl';

export class ApplicationContext {
  @Entity()
  public telegramBot(): TelegramBotImpl {
    return new TelegramBotImpl(process.env.telegramApiToken!, this.userService());
  }

  @Entity()
  public feedlyToTodoistWorker(): FeedlyToTodoistWorker {
    return new FeedlyToTodoistWorkerImpl(this.userService());
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
    return new EventDispatcherImpl(this.eventHandlerProvider());
  }

  @Entity()
  private eventHandlerProvider(): EventHandlerProvider {
    return new EventHandlerProviderImpl(
      () => this.userDao(),
      () => this.linkDao(),
      () => this.notesTransferService(),
      () => this.telegramBot(),
    );
  }

  @Entity()
  private notesTransferService(): NotesTransferService {
    return new NotesTransferServiceImpl(this.userService());
  }
}
