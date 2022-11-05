import { Job, CronJobController } from '../../utils/cron/CronStarter';
import { UserService } from '../../infrastructure-interfaces/service/UserService';

@CronJobController()
export class CronController {
  constructor(private readonly userService: UserService) {}

  @Job('*/2 * * * *')
  async moveFromFeedlyToTodoist() {
    await this.userService.forEach((user) => user.transferLinks());
  }
}
