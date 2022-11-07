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
      const countOnWeek = countOnDay * 7;
      const additionalLinks = this.takeAdditionalLinksOnWeek(links, countOnWeek);
      const articlesFromFeedlyCount = countOnWeek - additionalLinks.length;

      const articles = await this.feedlyClient.loadArticles(feedlyToken, feedlyStreamName, articlesFromFeedlyCount);
      await this.addAdditionalLinks(articles, additionalLinks);
      await this.todoistClient.addTasks(todoistToken, todoistProjectId, articles, countOnDay, true);
      await this.feedlyClient.markAsUnsaved(articles, feedlyToken);
      await this.userService.run(userId, async (user) => user.removeLinks(additionalLinks));
      return new Links(additionalLinks);
    } catch (e: any) {
      this.handleError(e, userId);
    }
  }

  private takeAdditionalLinksOnWeek(links: Links, countOnWeek: number) {
    return links.links.length > countOnWeek ? links.links.slice(0, countOnWeek) : links.links;
  }

  private async addAdditionalLinks(articles: Article[], additionalLinks: Link[]) {
    const additionalArticles = await this.convertToArticle(additionalLinks);
    articles.push(...additionalArticles);
  }

  private async convertToArticle(additionalLinks: Link[]): Promise<Article[]> {
    return Promise.all(
      additionalLinks
        .map((link) => link.value)
        .map(async (url) => ({
          url,
          id: this.idGenerator.generate(),
          title: await this.titleLoader.loadTitle(url),
        })),
    );
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
