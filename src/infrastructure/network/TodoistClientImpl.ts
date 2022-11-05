import { TodoistClient } from '../../infrastructure-interfaces/network/TodoistClient';
import { Article } from '../../infrastructure-interfaces/network/entities/Article';
import { Fetch } from '../../utils/fetch';
import { IdProvider } from '../../utils/providers/IdProvider';
import { DateProvider } from '../../utils/providers/DateProvider';
import { RandomProvider } from '../../utils/providers/RandomProvider';

export class TodoistClientImpl implements TodoistClient {
  constructor(
    private readonly idGenerator: IdProvider,
    private readonly dateGenerator: DateProvider,
    private readonly randomGenerator: RandomProvider,
    private readonly fetch: Fetch,
  ) {}

  async addTasks(token: string, projectId: string, articles: Article[], countOnDay: number, useRandom: boolean) {
    if (useRandom) {
      this.randomGenerator.shuffle(articles);
    }
    const realCountOnDay = Math.min(Math.ceil(articles.length / 7), countOnDay);
    for (let i = 0; i < Math.min(7 * realCountOnDay, articles.length); i++) {
      articles[i].date = await this.getDate(i / realCountOnDay);
      await this.addToTodoist(articles[i], token, projectId);
    }
  }

  async getDate(addDay: number): Promise<string> {
    const day = Math.floor(addDay);
    const date = this.dateGenerator.generate();
    date.setDate(date.getDate() + day);
    return date.toISOString().substring(0, 10);
  }

  async addToTodoist(article: Article, todoistToken: string, todoistProjectId: string) {
    await this.fetch('https://api.todoist.com/rest/v1/tasks').post({
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': this.idGenerator.generate(),
        Authorization: `Bearer ${todoistToken}`,
      },
      data: {
        project_id: todoistProjectId,
        due_date: article.date,
        content: `[${article.title}](${article.url})`,
      },
    });
  }
}
