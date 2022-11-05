import { Article } from './entities/Article';

export interface FeedlyClient {
  loadArticles(token: string, streamName: string, articlesCount: number): Promise<Article[]>;
  markAsUnsaved(articles: Article[], token: string): Promise<void>
}
