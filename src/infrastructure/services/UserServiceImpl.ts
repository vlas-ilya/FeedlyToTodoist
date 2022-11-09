import { UserService } from '../../infrastructure-interfaces/services/UserService';
import { User } from '../../domain/user/User';
import { UserRepository } from '../../repository-interfaces/UserRepository';
import { UserId } from '../../domain/user/vo/UserId';
import { EventDispatcher } from '../../infrastructure-interfaces/events/EventDispatcher';

export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository, private readonly eventDispatcher: EventDispatcher) {}

  async run(userId: string, fun: (user: User) => Promise<void>) {
    const user = await this.userRepository.getUser(new UserId(userId));
    await fun(user);
    await this.userRepository.save(user);
    await this.eventDispatcher.dispatch(...user.events());
  }

  async createUser(id: string): Promise<void> {
    const user = User.create(id);
    await this.userRepository.save(user);
    await this.eventDispatcher.dispatch(...user.events());
  }

  async forEach(fun: (user: User) => void) {
    const users = await this.userRepository.list();
    await Promise.all(
      users.map(async (user) => {
        fun(user);
        await this.userRepository.save(user);
        await this.eventDispatcher.dispatch(...user.events());
      }),
    );
  }
}
