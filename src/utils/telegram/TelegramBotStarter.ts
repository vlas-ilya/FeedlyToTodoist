import { Context, Telegraf } from 'telegraf';

type Method = string | symbol;

type Command = {
  command: string;
  description: string;
  method: Method;
};

const config = {
  botControllers: [] as any[],
  botControllerProviders: [] as (string | symbol)[],
  onStart: [] as Method[],
  onHelp: [] as Method[],
  onMessage: [] as Method[],
  onCommand: [] as Command[],
} as {
  bot: Telegraf;
  getApiKey?: () => string;
  starter?: any;
  botControllers: any[];
  botControllerProviders: (string | symbol)[];
  onStart: Method[];
  onHelp: Method[];
  onMessage: Method[];
  onCommand: Command[];
};

export function TelegramBotStarter(): ClassDecorator {
  return (target: any) => {
    config.starter = target;
    config.starter.prototype._start = config.starter.prototype._start ?? [];
    config.starter.prototype._start.push(() => createBot());
  };
}

async function createBot() {
  if (!config.getApiKey) {
    return;
  }

  const apiKey = config.getApiKey();

  config.bot = new Telegraf(apiKey);

  config.bot.start(async (ctx: Context) => {
    await Promise.all(
      config.onStart.map(async (method) => {
        config.botControllerProviders.forEach((provider) => {
          const controller = config.starter.prototype[provider]();
          const context = controller.getContext();
          if (controller[method] && controller[method]._onStart) {
            try {
              const promise = controller[method].bind(context)(ctx);
              if (promise instanceof Promise) {
                promise.catch(e => {
                  console.log("onStart", ctx, e);
                });
              }
            } catch (e) {
              console.log("onStart", ctx, e);
            }
          }
        });
      }),
    );
  });

  config.bot.help(async (ctx: Context) => {
    await Promise.all(
      config.onHelp.map(async (method) => {
        config.botControllerProviders.forEach((provider) => {
          const controller = config.starter.prototype[provider]();
          const context = controller.getContext();
          if (controller[method] && controller[method]._onHelp) {
            try {
              const promise = controller[method].bind(context)(ctx);
              if (promise instanceof Promise) {
                promise.catch(e => {
                  console.log("onStart", ctx, e);
                });
              }
            } catch (e) {
              console.log("onStart", ctx, e);
            }
          }
        });
      }),
    );
  });

  config.bot.on('text', async (ctx: Context) => {
    // @ts-ignore
    const commands = config.onCommand.filter((command) => command.command == ctx.message.text);

    if (commands.length == 0) {
      await Promise.all(
        config.onMessage.map(async (method) => {
          config.botControllerProviders.forEach((provider) => {
            const controller = config.starter.prototype[provider]();
            const context = controller.getContext();
            if (controller[method] && controller[method]._onMessage) {
              try {
                const promise = controller[method].bind(context)(ctx);
                if (promise instanceof Promise) {
                  promise.catch(e => {
                    console.log("onStart", ctx, e);
                  });
                }
              } catch (e) {
                console.log("onStart", ctx, e);
              }
            }
          });
        }),
      );
      return;
    }

    await Promise.all(
      commands.map(async (command) => {
        config.botControllerProviders.forEach((provider) => {
          const controller = config.starter.prototype[provider]();
          const context = controller.getContext();
          if (controller[command.method] && controller[command.method]._onCommand) {
            try {
              const promise = controller[command.method].bind(context)(ctx);
              if (promise instanceof Promise) {
                promise.catch(e => {
                  console.log("onStart", ctx, e);
                });
              }
            } catch (e) {
              console.log("onStart", ctx, e);
            }
          }
        });
      }),
    );
  });

  await config.bot.telegram.setMyCommands(
    config.onCommand.map((command) => ({
      command: command.command,
      description: command.description,
    })),
  );

  await config.bot.launch();

  console.log('Telegram bot was started');
}

export function TelegramBotControllerProvider(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    config.botControllerProviders.push(propertyKey);
  };
}

export function TelegramBotController(): ClassDecorator {
  return (target: any) => {
    target.prototype.getContext = function () {
      return this;
    };
  };
}

export function OnStart(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    target[propertyKey]._onStart = true;
    config.onStart.push(propertyKey);
  };
}

export function OnCommand(command: string, description: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    target[propertyKey]._onCommand = true;
    config.onCommand.push({
      command: `/${command}`,
      description,
      method: propertyKey,
    });
  };
}

export function OnMessage(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    target[propertyKey]._onMessage = true;
    config.onMessage.push(propertyKey);
  };
}

export function OnHelp(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    target[propertyKey]._onHelp = true;
    config.onHelp.push(propertyKey);
  };
}

export function TelegramApiToken(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    config.getApiKey = target[propertyKey];
  };
}

export function TelegramClientEndpoint(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    descriptor.value = function () {
      return {
        async send(chatId: string, message: string) {
          await config.bot.telegram.sendMessage(chatId, message);
        },
      } as TelegramClient;
    };
  };
}

export interface TelegramClient {
  send(chatId: string, message: string): Promise<void>;
}
