import { OnCommand, OnMessage, OnStart, TelegramBotController } from '../../utils/telegram/TelegramBotStarter';
import {
  RERUN_ARTICLES_TRANSFER,
  SET_FEEDLY_STREAM_NAME,
  SET_FEEDLY_TOKEN,
  SET_TODOIST_PROJECT_ID,
  SET_TODOIST_TOKEN,
} from '../../constants/commands';
import { UserService } from '../../infrastructure-interfaces/service/UserService';

@TelegramBotController()
export class TelegramController {
  constructor(private readonly userService: UserService) {}

  @OnStart()
  async onStart(ctx: any) {
    await this.userService.createUser(ctx.message.chat.id);
  }

  @OnCommand(`/${SET_FEEDLY_TOKEN}`, 'Установить API токен для Feedly')
  async changeFeedlyToken(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.changeFeedlyToken());
  }

  @OnCommand(`/${SET_FEEDLY_STREAM_NAME}`, 'Установить stream для Feedly')
  async changeFeedlyStreamName(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.changeFeedlyStreamName());
  }

  @OnCommand(`/${SET_TODOIST_TOKEN}`, 'Установить API токен для Todoist')
  async changeTodoistToken(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.changeTodoistToken());
  }

  @OnCommand(`/${SET_TODOIST_PROJECT_ID}`, 'Установить ID проекта для Todoist')
  async changeTodoistProjectId(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.changeTodoistProjectId());
  }

  @OnCommand(`/${RERUN_ARTICLES_TRANSFER}`, 'Запустить перенос ссылок вручную')
  async transferLinks(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.transferLinks());
  }

  @OnMessage()
  async someCommand(ctx: any) {
    await this.userService.run(ctx.message.chat.id, async (user) => user.setValue(ctx.message.text));
  }
}
