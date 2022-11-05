import { TitleLoader } from '../../infrastructure-interfaces/network/TitleLoader';
import { Fetch } from '../../utils/fetch';

export class TitleLoaderImpl implements TitleLoader {
  constructor(private readonly fetch: Fetch) {}

  async loadTitle(url: string) {
    const text = await this.fetch(url).get({});
    return this.parseTitle(text.data);
  }

  private parseTitle(text: string): string {
    let match = text.match(/<title>([^<]*)<\/title>/);
    if (!match || typeof match[1] !== 'string') return '';
    return match[1];
  }
}
