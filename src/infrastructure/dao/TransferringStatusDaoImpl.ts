import { TransferringStatusDao } from '../../infrastructure-interfaces/dao/TransferringStatusDao';
import { TransferringStatusDto } from '../../infrastructure-interfaces/dao/dto/TransferringStatusDto';
import { FileStorageProvider } from '../../infrastructure-interfaces/storage/FileStorageProvider';
import { EntityNotFoundError } from '../../infrastructure-interfaces/dao/errors/EntityNotFoundError';
import { LinksDto } from '../../infrastructure-interfaces/dao/dto/LinksDto';
import { LinkDto } from '../../infrastructure-interfaces/dao/dto/LinkDto';

export class TransferringStatusDaoImpl implements TransferringStatusDao {
  private readonly FILE_STORAGE_NAME = `transferring-dao`;

  constructor(private readonly fileStorageProvider: FileStorageProvider) {}

  async findById(id: string) {
    const fileStorage = await this.fileStorageProvider.getFileStorage(this.FILE_STORAGE_NAME, id);
    const value = await fileStorage.read();

    if (!value) {
      throw new EntityNotFoundError(id);
    }

    return new TransferringStatusDto(value.status, value.error);
  }

  async save(id: string, transferringStatusDto: TransferringStatusDto) {
    const fileStorage = await this.fileStorageProvider.getFileStorage(this.FILE_STORAGE_NAME, id);
    await fileStorage.write({
      value: transferringStatusDto.status,
      error: transferringStatusDto.error,
    });
  }
}
