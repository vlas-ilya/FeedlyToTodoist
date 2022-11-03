import { Context, Telegraf } from 'telegraf';
import {
  SET_FEEDLY_STREAM_NAME,
  SET_FEEDLY_TOKEN,
  SET_TODOIST_PROJECT_ID,
  SET_TODOIST_TOKEN,
} from '../../utils/commands';
import { UserService } from '../../infrastructure-interfaces/service/UserService';
import { TelegramClient } from '../../infrastructure-interfaces/network/TelegramClient';

export class TelegramBotImpl implements TelegramClient {
  private bot: Telegraf<Context>;

  constructor(private readonly apiToken: string, private readonly userService: UserService) {
    this.bot = new Telegraf(this.apiToken);
  }

  public async start() {
    this.bot.start(async (ctx: any) => await this.userService.createUser(ctx.message.chat.id));
    this.bot.help(async (ctx: any) => {
      /*todo*/
    });
    this.bot.on('text', async (ctx: any) => {
      switch (ctx.message.text) {
        case `/${SET_FEEDLY_TOKEN}`:
          await this.userService.run(ctx.message.chat.id, async (user) => user.changeFeedlyToken());
          return;
        case `/${SET_FEEDLY_STREAM_NAME}`:
          await this.userService.run(ctx.message.chat.id, async (user) => user.changeFeedlyStreamName());
          return;
        case `/${SET_TODOIST_TOKEN}`:
          await this.userService.run(ctx.message.chat.id, async (user) => user.changeTodoistToken());
          return;
        case `/${SET_TODOIST_PROJECT_ID}`:
          await this.userService.run(ctx.message.chat.id, async (user) => user.changeTodoistProjectId());
          return;
        default:
          await this.userService.run(ctx.message.chat.id, async (user) => user.setValue(ctx.message.text));
          return;
      }
    });

    await this.bot.telegram.setMyCommands([
      { command: SET_FEEDLY_TOKEN, description: 'Установить API токен для Feedly' },
      { command: SET_FEEDLY_STREAM_NAME, description: 'Установить stream для Feedly' },
      { command: SET_TODOIST_TOKEN, description: 'Установить API токен для Todoist' },
      { command: SET_TODOIST_PROJECT_ID, description: 'Установить ID проекта для Todoist' },
    ]);

    await this.bot.launch();
  }

  async send(chatId: string, message: string) {
    await this.bot.telegram.sendMessage(chatId, message);
  }
}
