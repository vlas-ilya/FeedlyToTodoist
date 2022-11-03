import { UserService } from '../../infrastructure-interfaces/service/UserService';
import { User } from '../../domain/user/User';
import { UserRepository } from '../../repository-interfaces/UserRepository';
import { UserId } from '../../domain/user/UserId';
import { EventDispatcher } from '../../infrastructure-interfaces/event/EventDispatcher';
import { UserInfo } from '../../domain/user/UserInfo';
import { Links } from '../../domain/user/Links';

export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository, private readonly eventDispatcher: EventDispatcher) {}

  async run(userId: string, fun: (user: User) => Promise<void>) {
    const user = await this.userRepository.getUser(new UserId(userId));
    await fun(user);
    await this.eventDispatcher.dispatch(...user.events());
  }

  async createUser(id: string): Promise<void> {
    const user = new User(new UserId(id), new UserInfo(), new Links([]));
    user.create();
    await this.userRepository.createEmptyUser(new UserId(id));
    await this.eventDispatcher.dispatch(...user.events());
  }

  async forEach(fun: (user: User) => void) {
    const users = await this.userRepository.list();
    await Promise.all(
      users.map(async (user) => {
        fun(user);
        await this.eventDispatcher.dispatch(...user.events());
      }),
    );
  }
}
