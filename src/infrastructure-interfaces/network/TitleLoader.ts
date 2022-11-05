export interface TitleLoader {
  loadTitle(url: string): Promise<string>;
}
