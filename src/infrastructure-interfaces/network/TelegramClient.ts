export interface TelegramClient {
  send(chatId: string, message: string): Promise<void>;
}
