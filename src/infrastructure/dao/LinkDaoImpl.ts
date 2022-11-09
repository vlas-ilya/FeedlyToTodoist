import { LinkDao } from '../../infrastructure-interfaces/dao/LinkDao';
import { LinksDto } from '../../infrastructure-interfaces/dao/dto/LinksDto';

export class LinkDaoImpl implements LinkDao {
  private linkDtoDatabase: {
    [key: string]: LinksDto;
  } = {};

  async findById(id: string): Promise<LinksDto> {
    return this.linkDtoDatabase[id];
  }

  async save(id: string, linkDto: LinksDto) {
    this.linkDtoDatabase[id] = linkDto;
  }
}
