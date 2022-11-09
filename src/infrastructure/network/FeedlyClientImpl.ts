import { FeedlyClient } from '../../infrastructure-interfaces/network/FeedlyClient';
import { Fetch } from '../../utils/fetch';
import { Article } from '../../infrastructure-interfaces/network/entities/Article';

export class FeedlyClientImpl implements FeedlyClient {
  constructor(private readonly fetch: Fetch) {}

  async loadArticles(token: string, streamName: string, articlesCount: number) {
    if (articlesCount == 0) {
      return [];
    }
    const url = `https://cloud.feedly.com/v3/streams/${streamName}/contents?count=${articlesCount}`;
    const data = await this.fetch(url).get({
      headers: {
        Authorization: `OAuth ${token}`,
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

  async markAsUnsaved(articles: Article[], token: string) {
    const ignored = await this.fetch(`https://cloud.feedly.com/v3/markers`).post({
      data: {
        action: 'markAsUnsaved',
        type: 'entries',
        entryIds: articles.map((item: any) => item.id),
      },
      headers: {
        Authorization: `OAuth ${token}`,
      },
    });
  }
}