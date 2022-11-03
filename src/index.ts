import { ApplicationContext } from './application/context/ApplicationContext';
import dotenv from 'dotenv';

dotenv.config();

const context = new ApplicationContext();
const bot = context.telegramBot();
const worker = context.feedlyToTodoistWorker();

bot
  .start()
  .then(() => console.log('Bot starts'))
  .catch((t: any) => console.log('Bot failed', t));

worker
  .start()
  .then(() => console.log('Worker starts'))
  .catch((t: any) => console.log('Worker failed', t));
