import { NotesTransferService } from '../../infrastructure-interfaces/network/NotesTransferService';
const { v4: uuidv4 } = require('uuid');
import { fetch } from '../../utils/fetch';
import { UserService } from '../../infrastructure-interfaces/services/UserService';
import { Link } from '../../domain/user/vo/Link';
import { IncorrectFeedlyCredentialsError } from './error/IncorrectFeedlyCredentialsError';
import { UnknownError } from './error/UnknownError';
import { IncorrectTodoistCredentialsError } from './error/IncorrectTodoistCredentialsError';

export type Article = {
  id: string;
  url: string;
  title: string;
  date?: string;
};

export class NotesTransferServiceImpl implements NotesTransferService {
  constructor(private readonly userService: UserService) {}

  async transfer(
    userId: string,
    feedlyStreamName: string,
    feedlyToken: string,
    todoistToken: string,
    todoistProjectId: string,
    additionalLinks: Link[],
  ) {
    try {
      const countOnDay = 7;
      const countOnWeek = countOnDay * 7;

      if (additionalLinks.length > countOnWeek) {
        additionalLinks = additionalLinks.slice(0, countOnWeek);
      }

      const articlesFromFeedlyCount = countOnWeek - additionalLinks.length;
      const articles = await this.loadArticlesFromFeedly(feedlyStreamName, articlesFromFeedlyCount, feedlyToken);
      await this.addAdditionalLinks(articles, additionalLinks);
      await this.addArticlesToTodoist(articles, countOnDay, todoistToken, todoistProjectId);
      await this.markAsUnsavedInFeedly(articles, feedlyToken);
      await this.removeUserLinks(userId, additionalLinks);
    } catch (e: any) {
      if (e.message == 'Request failed with status code 400' && e.config.url.startsWith('https://cloud.feedly.com/')) {
        throw new IncorrectFeedlyCredentialsError(userId);
      }
      if (e.message == 'Request failed with status code 401' && e.config.url.startsWith('https://api.todoist.com/')) {
        throw new IncorrectTodoistCredentialsError(userId);
      }
      throw new UnknownError(userId);
    }
  }

  async loadArticlesFromFeedly(
    feedlyStreamName: string,
    articlesFromFeedlyCount: number,
    feedlyToken: string,
  ): Promise<Article[]> {
    if (articlesFromFeedlyCount == 0) {
      return [];
    }
    const url = `https://cloud.feedly.com/v3/streams/${feedlyStreamName}/contents?count=${articlesFromFeedlyCount}`;
    const data = await fetch(url).get({
      headers: {
        Authorization: `OAuth ${feedlyToken}`,
      },
    });

    return data.data.items.map(
      (item: any) =>
        ({
          id: item['id'],
          url: item['originId'],
          title: item['title'],
        } as Article),
    );
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
          id: uuidv4(),
          url,
          title: await this.loadTitle(url),
        })),
    );
  }

  private async loadTitle(url: string): Promise<string> {
    const text = await fetch(url).get({});
    return this.parseTitle(text.data);
  }

  private parseTitle(text: string): string {
    let match = text.match(/<title>([^<]*)<\/title>/);
    if (!match || typeof match[1] !== 'string') return '';
    return match[1];
  }

  async addArticlesToTodoist(articles: Article[], countOnDay: number, todoistToken: string, todoistProjectId: string) {
    articles.sort(() => Math.random() - 0.5);
    const realCountOnDay = Math.min(Math.ceil(articles.length / 7), countOnDay);
    for (let i = 0; i < Math.min(7 * realCountOnDay, articles.length); i++) {
      articles[i].date = await this.getDate(i / realCountOnDay);
      await this.addToTodoist(articles[i], todoistToken, todoistProjectId);
    }
  }

  async getDate(addDay: number): Promise<string> {
    const day = Math.floor(addDay);
    const date = new Date();
    date.setDate(date.getDate() + day);
    return date.toISOString().substring(0, 10);
  }

  async addToTodoist(article: Article, todoistToken: string, todoistProjectId: string) {
    await fetch('https://api.todoist.com/rest/v1/tasks').post({
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': uuidv4(),
        Authorization: `Bearer ${todoistToken}`,
      },
      data: {
        project_id: todoistProjectId,
        due_date: article.date,
        content: `[${article.title}](${article.url})`,
      },
    });
  }

  async markAsUnsavedInFeedly(articles: Article[], feedlyToken: string) {
    const ignored = await fetch(`https://cloud.feedly.com/v3/markers`).post({
      data: {
        action: 'markAsUnsaved',
        type: 'entries',
        entryIds: articles.map((item: any) => item.id),
      },
      headers: {
        Authorization: `OAuth ${feedlyToken}`,
      },
    });
  }

  private async removeUserLinks(userId: string, additionalLinks: Link[]) {
    await this.userService.run(userId, async (user) => user.removeLinks(additionalLinks));
  }
}
