import { TransferringStatusDao } from '../../infrastructure-interfaces/dao/TransferringStatusDao';
import { TransferringStatusDto } from '../../infrastructure-interfaces/dao/dto/TransferringStatusDto';

export class TransferringStatusDaoImpl implements TransferringStatusDao {
  private transferringStatusDtoDatabase: {
    [key: string]: TransferringStatusDto;
  } = {};

  async findById(id: string) {
    return this.transferringStatusDtoDatabase[id];
  }

  async saveTransferringStatus(id: string, transferringStatusDto: TransferringStatusDto) {
    this.transferringStatusDtoDatabase[id] = transferringStatusDto;
  }
}
