import { TodoistClient } from '../../infrastructure-interfaces/network/TodoistClient';
import { Article } from '../../infrastructure-interfaces/network/entities/Article';
import { IdProvider } from '../../utils/providers/IdProvider';
import { DateProvider } from '../../utils/providers/DateProvider';
import { AddTaskArgs } from '@doist/todoist-api-typescript/dist/types/requests';
import { TodoistApiProvider } from '../../utils/providers/TodoistApiProvider';
import { DEFAULT_TITLE_VALUE } from './TitleLoaderImpl';

export class TodoistClientImpl implements TodoistClient {
  constructor(
    private readonly idProvider: IdProvider,
    private readonly dateProvider: DateProvider,
    private readonly todoistApiProvider: TodoistApiProvider,
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
    const todoistApi = this.todoistApiProvider.get(todoistToken);
    const task = {
      project_id: todoistProjectId,
      due_date: article.date,
      content: article.title !== DEFAULT_TITLE_VALUE
        ? `[${article.title}](${article.url})`
        : article.url,
    } as AddTaskArgs;
    await todoistApi.addTask(task, this.idProvider.generate());
  }
}
