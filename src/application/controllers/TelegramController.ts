import { OnCommand, OnMessage, OnStart, TelegramBotController } from '../../utils/telegram/TelegramBotStarter';
import {
  RERUN_ARTICLES_TRANSFER,
  SET_DAILY_PLAN,
  SET_FEEDLY_STREAM_NAME,
  SET_FEEDLY_TOKEN,
  SET_TODOIST_PROJECT_ID,
  SET_TODOIST_TOKEN,
  STATUS,
} from '../../constants/commands';
import { UserService } from '../../infrastructure-interfaces/services/UserService';
import { DateProvider } from '../../utils/providers/DateProvider';

@TelegramBotController()
export class TelegramController {
  constructor(private readonly userService: UserService, private readonly dateGenerator: DateProvider) {}

  @OnStart()
  async onStart(ctx: any) {
    await this.userService.createUser(ctx.message.chat.id);
  }

  @OnCommand(SET_FEEDLY_TOKEN.command, SET_FEEDLY_TOKEN.description)
  async changeFeedlyToken(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.changeFeedlyToken());
  }

  @OnCommand(SET_FEEDLY_STREAM_NAME.command, SET_FEEDLY_STREAM_NAME.description)
  async changeFeedlyStreamName(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.changeFeedlyStreamName());
  }

  @OnCommand(SET_TODOIST_TOKEN.command, SET_TODOIST_TOKEN.description)
  async changeTodoistToken(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.changeTodoistToken());
  }

  @OnCommand(SET_TODOIST_PROJECT_ID.command, SET_TODOIST_PROJECT_ID.description)
  async changeTodoistProjectId(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.changeTodoistProjectId());
  }

  @OnCommand(SET_DAILY_PLAN.command, SET_DAILY_PLAN.description)
  async setDailyPlan(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.setDailyPlan());
  }

  @OnCommand(RERUN_ARTICLES_TRANSFER.command, RERUN_ARTICLES_TRANSFER.description)
  async transferLinks(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.transferLinks());
  }

  @OnCommand(STATUS.command, STATUS.description)
  async showStatus(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.showStatus());
  }

  @OnMessage()
  async someCommand(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) =>
      user.setValue(ctx.message.text, this.dateGenerator),
    );
  }
}
