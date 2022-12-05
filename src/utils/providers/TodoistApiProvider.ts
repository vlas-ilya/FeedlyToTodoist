import { AddTaskArgs } from '@doist/todoist-api-typescript/dist/types/requests';
import { Task } from '@doist/todoist-api-typescript/dist/types/entities';

export interface TodoistApi {
  addTask(args: AddTaskArgs, requestId?: string): Promise<Task>;
}

export interface TodoistApiProvider {
  get(authToken: string, baseUrl?: string): TodoistApi;
}
