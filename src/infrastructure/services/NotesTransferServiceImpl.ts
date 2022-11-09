import { NotesTransferService } from '../../infrastructure-interfaces/services/NotesTransferService';
import { UserService } from '../../infrastructure-interfaces/services/UserService';
import { Link } from '../../domain/user/vo/Link';
import { IncorrectFeedlyCredentialsError } from '../../infrastructure-interfaces/network/error/IncorrectFeedlyCredentialsError';
import { UnknownError } from '../../infrastructure-interfaces/network/error/UnknownError';
import { IncorrectTodoistCredentialsError } from '../../infrastructure-interfaces/network/error/IncorrectTodoistCredentialsError';
import { FeedlyClient } from '../../infrastructure-interfaces/network/FeedlyClient';
import { TodoistClient } from '../../infrastructure-interfaces/network/TodoistClient';
import { TitleLoader } from '../../infrastructure-interfaces/network/TitleLoader';
import { Article } from '../../infrastructure-interfaces/network/entities/Article';
import { UserInfo } from '../../domain/user/vo/UserInfo';
import { Links } from '../../domain/user/vo/Links';
import { IdProvider } from '../../utils/providers/IdProvider';
import { DEFAULT_DAILY_PLAN } from '../../constants/common';
import { WeekSchedule } from './utils/WeekSchedule';

export class NotesTransferServiceImpl implements NotesTransferService {
  constructor(
    private readonly userService: UserService,
    private readonly feedlyClient: FeedlyClient,
    private readonly todoistClient: TodoistClient,
    private readonly titleLoader: TitleLoader,
    private readonly idGenerator: IdProvider,
  ) {}

  async transfer(
    userId: string,
    { feedlyToken, feedlyStreamName, todoistToken, todoistProjectId, dailyPlan }: UserInfo,
    links: Links,
  ): Promise<Links> {
    if (!feedlyStreamName || !feedlyToken || !todoistToken || !todoistProjectId) {
      return Links.empty();
    }

    try {
      const countOnDay = dailyPlan || DEFAULT_DAILY_PLAN;
      const weekSchedule = new WeekSchedule(countOnDay, async (link: Link) => await this.convertToArticle(link));
      await weekSchedule.addLinks(links.links);
      const articles = await this.feedlyClient.loadArticles(feedlyToken, feedlyStreamName, weekSchedule.freeSlots());
      await weekSchedule.addArticles(articles);
      await this.todoistClient.addTasks(todoistToken, todoistProjectId, weekSchedule.getSchedule());
      await this.feedlyClient.markAsUnsaved(articles, feedlyToken);
      return new Links(weekSchedule.addedLinks());
    } catch (e: any) {
      this.handleError(e, userId);
    }
  }

  private async convertToArticle(link: Link): Promise<Article> {
    return {
      url: link.value,
      id: this.idGenerator.generate(),
      title: await this.titleLoader.loadTitle(link.value),
    };
  }

  private handleError(e: any, userId: string): never {
    if (e.message == 'Request failed with status code 400' && e.config.url.startsWith('https://cloud.feedly.com/')) {
      throw new IncorrectFeedlyCredentialsError(userId);
    }
    if (e.message == 'Request failed with status code 401' && e.config.url.startsWith('https://api.todoist.com/')) {
      throw new IncorrectTodoistCredentialsError(userId);
    }
    throw new UnknownError(userId);
  }
}
