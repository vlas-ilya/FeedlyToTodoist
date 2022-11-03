import { FeedlyToTodoistWorker } from '../../infrastructure-interfaces/cron/FeedlyToTodoistWorker';
import { UserService } from '../../infrastructure-interfaces/service/UserService';
import cron from 'node-cron';

export class FeedlyToTodoistWorkerImpl implements FeedlyToTodoistWorker {
  private readonly CRON = '*/2 * * * *';

  constructor(private readonly userService: UserService) {}

  async start() {
    cron.schedule(this.CRON, async () => await this.moveFromFeedlyToTodoist());
  }

  private async moveFromFeedlyToTodoist() {
    await this.userService.forEach((user) => user.transferLinks());
  }
}
