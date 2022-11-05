import { Article } from './entities/Article';

export interface TodoistClient {
  addTasks(
    token: string,
    projectId: string,
    articles: Article[],
    countOnDay: number,
    useRandom: boolean,
  ): Promise<void>;
}
