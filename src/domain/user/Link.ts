import { BaseValueObject } from '../base/BaseValueObject';
import { ValueIsNotUrlError } from './error/ValueIsNotUrlError';

export class Link extends BaseValueObject {
  public static readonly linksRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  public static readonly linkRegex =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  constructor(public readonly value: string) {
    super();
    const regex = new RegExp(Link.linkRegex);
    if (!value.match(regex)) {
      throw new ValueIsNotUrlError(value);
    }
  }

  equals(object: BaseValueObject): boolean {
    if (!object) {
      return false;
    }

    if (object! instanceof Link) {
      return false;
    }

    const link = object as Link;

    return this.value == link.value;
  }

  public static convertToLinks(value: string): Link[] {
    return [...value.matchAll(Link.linksRegex)].map((value) => new Link(value[0]));
  }
}
