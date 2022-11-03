import { EventHandler } from '../../../infrastructure-interfaces/event/handlers/EventHandler';
import { UserLinksWasUpdatedEvent } from '../../../domain/user/events/UserLinksWasUpdatedEvent';
import { LinksDto } from '../../../infrastructure-interfaces/dao/dto/LinksDto';
import { LinkDao } from '../../../infrastructure-interfaces/dao/LinkDao';

export class UserLinksWasUpdatedEventHandler implements EventHandler<UserLinksWasUpdatedEvent> {
  constructor(private readonly linkDao: LinkDao) {}

  async handle(event: UserLinksWasUpdatedEvent) {
    await this.linkDao.saveUserLinks(event.userId.value, new LinksDto(event.links.links.map((link) => link.value)));
  }
}
