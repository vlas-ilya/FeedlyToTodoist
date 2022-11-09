import { TodoistClient } from '../../infrastructure-interfaces/network/TodoistClient';
import { Article } from '../../infrastructure-interfaces/network/entities/Article';
import { Fetch } from '../../utils/fetch';
import { IdProvider } from '../../utils/providers/IdProvider';
import { DateProvider } from '../../utils/providers/DateProvider';

export class TodoistClientImpl implements TodoistClient {
  constructor(
    private readonly idProvider: IdProvider,
    private readonly dateProvider: DateProvider,
    private readonly fetch: Fetch,
  ) {}

  async addTasks(token: string, projectId: string, articles: Article[][]) {
    for (let i = 0; i < articles.length; i++) {
      for (let j = 0; j < articles[i].length; j++) {
        articles[i][j].date = await this.getDate(i);
        await this.addToTodoist(articles[i][j], token, projectId);
      }
    }
  }

  async getDate(day: number): Promise<string> {
    const date = this.dateProvider.generate();
    date.setDate(date.getDate() + day);
    return date.toISOString().substring(0, 10);
  }

  async addToTodoist(article: Article, todoistToken: string, todoistProjectId: string) {
    await this.fetch('https://api.todoist.com/rest/v1/tasks').post({
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': this.idProvider.generate(),
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
