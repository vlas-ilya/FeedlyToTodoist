import { LinksDto } from './dto/LinksDto';

export interface LinkDao {
  findById(id: string): Promise<LinksDto>;
  save(id: string, linksDto: LinksDto): Promise<void>;
}
