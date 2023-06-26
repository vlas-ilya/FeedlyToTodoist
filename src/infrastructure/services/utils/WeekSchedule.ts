import { Article } from '../../../infrastructure-interfaces/network/entities/Article';
import { Link } from '../../../domain/user/vo/Link';

export class WeekSchedule {
  private _tmpStartGroupPosition = 0;

  private readonly _addedLinks = [] as Link[];
  private readonly _addedArticles = [] as Article[];
  private readonly _schedule = [
    [] as Article[], // Monday
    [] as Article[], // Tuesday
    [] as Article[], // Wednesday
    [] as Article[], // Thursday
    [] as Article[], // Friday
    [] as Article[], // Saturday
    [] as Article[], // Sunday
  ];

  constructor(private readonly countOnDay: number, private readonly converter: (link: Link) => Promise<Article>) {}

  async addLinks(links: Link[]) {
    const groups = this.splitOnGroups(links);
    for (const group of groups) {
      await this.findPlaceForGroup(group);
    }
  }

  private splitOnGroups(links: Link[]): Link[][] {
    const groups = {} as {
      [key: string]: Link[];
    };
    for (const link of links) {
      const group = link.groupName();
      groups[group] = groups[group] || [];
      groups[group].push(link);
    }
    return Object.entries(groups).map((entry) => entry[1]);
  }

  private async findPlaceForGroup(group: Link[]) {
    let position = this.findStartPositionForGroup(group);
    for (const link of group) {
      if (this._schedule[position].length >= this.countOnDay) {
        position += 1;
        if (position >= 7) {
          return;
        }
        continue;
      }
      this._schedule[position].push(await this.converter(link));
      this._addedLinks.push(link);
      position += 1;
      if (position >= 7) {
        return;
      }
    }
  }

  private findStartPositionForGroup(group: Link[]): number {
    let startGroupPosition = this._tmpStartGroupPosition;
    while (true) {
      if (this.testStartPosition(startGroupPosition, group)) {
        this._tmpStartGroupPosition = (this._tmpStartGroupPosition + 1) % 7;
        return startGroupPosition;
      }
      startGroupPosition = (startGroupPosition + 1) % 7;
      if (startGroupPosition == this._tmpStartGroupPosition) {
        return 0;
      }
    }
  }

  private testStartPosition(startGroupPosition: number, group: Link[]): boolean {
    let groupSize = group.length;
    for (let position = startGroupPosition; position < 7; position++) {
      if (this._schedule[position].length < this.countOnDay) {
        groupSize -= 1;
        if (groupSize == 0) {
          return true;
        }
      }
    }
    return false;
  }

  freeSlots(): number {
    return this.countOnDay * 7 - this._schedule.reduce((acc, list) => acc + list.length, 0);
  }

  addArticles(articles: Article[]) {
    let day = 0;
    for (const article of articles) {
      day = this.findPlaceForArticle(article, day);
    }
  }

  private findPlaceForArticle(article: Article, day: number): number {
    let currentDay = day;
    while (true) {
      if (this._schedule[currentDay].length < this.countOnDay) {
        this._schedule[currentDay].push(article);
        this._addedArticles.push(article);
        return (currentDay + 1) % 7;
      }
      currentDay = (currentDay + 1) % 7;
      if (currentDay == day) {
        return day;
      }
    }
  }

  addedArticles(): Article[] {
    return this._addedArticles;
  }

  addedLinks(): Link[] {
    return this._addedLinks;
  }

  getSchedule(): Article[][] {
    return this._schedule;
  }
}
