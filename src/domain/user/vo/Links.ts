import { BaseValueObject } from '../../../utils/domain/BaseValueObject';
import { Link } from './Link';

export class Links extends BaseValueObject {
  constructor(public readonly links: Link[]) {
    super();
  }

  static empty(): Links {
    return new Links([]);
  }

  addLinks(value: Link[]) {
    this.links.push(...value);
  }

  removeLinks(links: Link[]): Links {
    return new Links(this.links.filter((link) => this.includes(links, link)));
  }

  private includes(links: Link[], link: Link) {
    return links.some((value) => value.equals(link));
  }
}
