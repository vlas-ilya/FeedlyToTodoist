import { Link } from '../../../domain/user/vo/Link';

export class LinkDto {
  constructor(public readonly value: string, public readonly date: Date) {}

  static fromEntity(link: Link): LinkDto {
    return new LinkDto(link.value, link.date);
  }

  toEntity(): Link {
    return new Link(this.value, this.date);
  }
}
