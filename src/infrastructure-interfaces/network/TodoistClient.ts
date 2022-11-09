import { Article } from './entities/Article';

export interface TodoistClient {
  addTasks(token: string, projectId: string, articles: Article[][]): Promise<void>;
}
