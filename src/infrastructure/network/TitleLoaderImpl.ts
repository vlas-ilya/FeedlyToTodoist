import { TitleLoader } from '../../infrastructure-interfaces/network/TitleLoader';
import { Fetch } from '../../utils/fetch';
import { ifNotEmpty } from '../../utils/strings/ifNotEmpty';

export const DEFAULT_TITLE_VALUE = 'Не удалось загрузить заголовок';

export class TitleLoaderImpl implements TitleLoader {
  constructor(private readonly fetch: Fetch) {}

  async loadTitle(url: string) {
    try {
      const text = await this.tryGetContent(url);
      const title = this.parseTitle(text);
      return ifNotEmpty(title, DEFAULT_TITLE_VALUE);
    } catch (e) {
      console.log('loadTitle error: ', e);
      return DEFAULT_TITLE_VALUE;
    }
  }

  async tryGetContent(url: string): Promise<string> {
    try {
      const { data } = await this.fetch(url).get({});
      return data;
    } catch (e) {
      console.log(`tryGetContent this.fetch("${url}").get({}) error: `, e);
      try {
        const titleByHttpie = this.fetch(url).getByHttpie();
        if (titleByHttpie === '405 Not Allowed') {
          throw '405 Not Allowed';
        }
        return titleByHttpie;
      } catch (e) {
        console.log(`tryGetContent this.fetch("${url}").getByHttpie() error: `, e);
        throw e;
      }
    }
  }

  private parseTitle(text: string): string {
    let match = text.match(/<title>([^<]*)<\/title>/);
    if (!match || typeof match[1] !== 'string') return '';
    return match[1].trim().replace(new RegExp('&nbsp;', 'g'), '');
  }
}
