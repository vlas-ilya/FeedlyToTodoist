import { LinksDto } from './dto/LinksDto';

export interface LinkDao {
  findById(value: string): Promise<LinksDto>;
  saveUserLinks(value: string, map: LinksDto): Promise<void>;
}
