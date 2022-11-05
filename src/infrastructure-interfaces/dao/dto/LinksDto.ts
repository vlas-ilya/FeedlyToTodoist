import { Links } from '../../../domain/user/vo/Links';
import { LinkDto } from './LinkDto';

export class LinksDto {
  constructor(public readonly value: LinkDto[]) {}

  static fromEntity(links: Links): LinksDto {
    return new LinksDto(links.links.map((link) => LinkDto.fromEntity(link)));
  }

  toEntity(): Links {
    return new Links(this.value?.map((value) => value.toEntity()) ?? []);
  }
}
