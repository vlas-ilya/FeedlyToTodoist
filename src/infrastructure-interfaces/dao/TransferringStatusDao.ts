import { TransferringStatusDto } from './dto/TransferringStatusDto';

export interface TransferringStatusDao {
  findById(id: string): Promise<TransferringStatusDto>;
  save(id: string, transferringStatusDto: TransferringStatusDto): Promise<void>;
}
