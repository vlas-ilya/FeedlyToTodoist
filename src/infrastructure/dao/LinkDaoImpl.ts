import { LinkDao } from '../../infrastructure-interfaces/dao/LinkDao';
import { LinksDto } from '../../infrastructure-interfaces/dao/dto/LinksDto';
import { FileStorageProvider } from '../../infrastructure-interfaces/storage/FileStorageProvider';
import { EntityNotFoundError } from '../../infrastructure-interfaces/dao/errors/EntityNotFoundError';
import { LinkDto } from '../../infrastructure-interfaces/dao/dto/LinkDto';

export class LinkDaoImpl implements LinkDao {
  private readonly FILE_STORAGE_NAME = `link-dao`;

  constructor(private readonly fileStorageProvider: FileStorageProvider) {}

  async findById(id: string): Promise<LinksDto> {
    const fileStorage = await this.fileStorageProvider.getFileStorage(this.FILE_STORAGE_NAME, id);
    const value = await fileStorage.read();

    if (!value) {
      throw new EntityNotFoundError(id);
    }

    const links = value.value.map((link: any) => new LinkDto(link.value, new Date(link.date), link.group));

    return new LinksDto(links);
  }

  async save(id: string, linksDto: LinksDto) {
    const fileStorage = await this.fileStorageProvider.getFileStorage(this.FILE_STORAGE_NAME, id);
    await fileStorage.write({
      value: linksDto.value.map((link) => ({
        value: link.value,
        date: link.date.getTime(),
        group: link.group,
      })),
    });
  }
}
