import { BaseValueObject } from '../../../utils/domain/BaseValueObject';
import { arrayEquals } from '../../../utils/arrayEquals';
import { Link } from './Link';

export class Links extends BaseValueObject {
  constructor(public readonly links: Link[]) {
    super();
  }

  equals(object: BaseValueObject): boolean {
    if (!object) {
      return false;
    }

    if (object! instanceof Links) {
      return false;
    }

    const links = object as Links;

    return arrayEquals(this.links, links.links);
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
