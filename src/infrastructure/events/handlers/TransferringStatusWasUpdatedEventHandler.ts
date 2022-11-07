import { EventHandler } from '../../../infrastructure-interfaces/events/handlers/EventHandler';
import { TransferringStatusWasUpdatedEvent } from '../../../domain/user/events/TransferringStatusWasUpdatedEvent';
import { TransferringStatusDao } from '../../../infrastructure-interfaces/dao/TransferringStatusDao';
import { TransferringStatusDto } from '../../../infrastructure-interfaces/dao/dto/TransferringStatusDto';

export class TransferringStatusWasUpdatedEventHandler implements EventHandler<TransferringStatusWasUpdatedEvent> {
  constructor(private readonly transferringStatusDao: TransferringStatusDao) {}

  async handle(event: TransferringStatusWasUpdatedEvent) {
    await this.transferringStatusDao.saveTransferringStatus(
      event.userId.value,
      TransferringStatusDto.fromEntity(event.transferringStatus),
    );
  }
}
