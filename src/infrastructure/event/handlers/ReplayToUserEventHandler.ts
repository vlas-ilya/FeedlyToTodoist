import { EventHandler } from '../../../infrastructure-interfaces/event/handlers/EventHandler';
import { ReplayToUserEvent } from '../../../domain/user/events/ReplayToUserEvent';
import { TelegramClient } from '../../../infrastructure-interfaces/network/TelegramClient';

export class ReplayToUserEventHandler implements EventHandler<ReplayToUserEvent> {
  constructor(private readonly telegramClient: TelegramClient) {}

  async handle(event: ReplayToUserEvent) {
    await this.telegramClient.send(event.userId.value, event.message);
  }
}
