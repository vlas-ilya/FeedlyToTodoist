import { Job, CronJobController } from '../../utils/cron/CronStarter';
import { UserService } from '../../infrastructure-interfaces/services/UserService';
import { CRON } from '../../constants/common';

@CronJobController()
export class CronController {
  constructor(private readonly userService: UserService) {}

  @Job(CRON)
  async moveFromFeedlyToTodoist() {
    await this.userService.forEach((user) => user.transferLinks());
  }
}
