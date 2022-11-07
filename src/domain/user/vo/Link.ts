import { BaseValueObject } from '../../../utils/domain/BaseValueObject';
import { ValueIsNotUrlError } from '../errors/ValueIsNotUrlError';
import { DateProvider } from '../../../utils/providers/DateProvider';

export class Link extends BaseValueObject {
  public static readonly extractLinksRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  public static readonly checkLinkRegex =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  constructor(public readonly value: string, public readonly date: Date) {
    super();
    const regex = new RegExp(Link.checkLinkRegex);
    if (!value.match(regex)) {
      throw new ValueIsNotUrlError(value);
    }
  }

  public static convertToLinks(value: string, dateGenerator: DateProvider): Link[] {
    return [...value.matchAll(Link.extractLinksRegex)].map((value) => new Link(value[0], dateGenerator.generate()));
  }
}
