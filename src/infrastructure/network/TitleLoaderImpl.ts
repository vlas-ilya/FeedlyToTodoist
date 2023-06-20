import { TitleLoader } from '../../infrastructure-interfaces/network/TitleLoader';
import { Fetch } from '../../utils/fetch';
import { ifNotEmpty } from '../../utils/strings/ifNotEmpty';

export const DEFAULT_TITLE_VALUE = 'Не удалось загрузить заголовок';

export class TitleLoaderImpl implements TitleLoader {
  constructor(private readonly fetch: Fetch) {}

  async loadTitle(url: string) {
    try {
      const text = this.fetch(url).getByHttpie();
      const title = this.parseTitle(text);
      return ifNotEmpty(title, DEFAULT_TITLE_VALUE);
    } catch (e) {
      console.log('loadTitle error: ', e);
      return DEFAULT_TITLE_VALUE;
    }
  }

  private parseTitle(text: string): string {
    let match = text.match(/<title>([^<]*)<\/title>/);
    if (!match || typeof match[1] !== 'string') return '';
    return match[1].trim().replace(new RegExp('&nbsp;', 'g'), '');
  }
}
