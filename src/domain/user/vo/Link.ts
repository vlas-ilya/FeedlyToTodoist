import { BaseValueObject } from '../../../utils/domain/BaseValueObject';
import { ValueIsNotUrlError } from '../errors/ValueIsNotUrlError';
import { DateProvider } from '../../../utils/providers/DateProvider';
import { IdProvider } from '../../../utils/providers/IdProvider';

export class Link extends BaseValueObject {
  public static readonly extractLinksRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  public static readonly checkLinkRegex =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  constructor(public readonly value: string, public readonly date: Date, public readonly group: string) {
    super();
    const regex = new RegExp(Link.checkLinkRegex);
    if (!value.match(regex)) {
      throw new ValueIsNotUrlError(value);
    }
  }

  public static convertToLinks(value: string, dateProvider: DateProvider, idProvider: IdProvider): Link[] {
    const group = idProvider.generate();
    const date = dateProvider.generate();
    return [...value.matchAll(Link.extractLinksRegex)].map(
      (value, index) => new Link(value[0], date, `${index}_${group}`),
    );
  }

  public groupName() {
    const groupMatches = this.group.match(/\d+_(.*)/);
    return groupMatches && groupMatches.length === 2
      ? groupMatches[1]
      : this.group;
  }
}
