import { FileStorage } from './FileStorage';

export interface FileStorageProvider {
  getFileStorage(name: string, id: string): Promise<FileStorage>;
  getFileStorageIds(name: string): Promise<string[]>;
}
