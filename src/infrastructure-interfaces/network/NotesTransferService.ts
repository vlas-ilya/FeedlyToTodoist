import { Link } from '../../domain/user/vo/Link';

export interface NotesTransferService {
  transfer(
    userId: string,
    feedlyStreamName: string,
    feedlyToken: string,
    todoistToken: string,
    todoistProjectId: string,
    additionalLinks: Link[],
  ): Promise<void>;
}
