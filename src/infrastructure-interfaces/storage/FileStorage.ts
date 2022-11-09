export interface FileStorage {
  write(value: any): Promise<void>;
  read(): Promise<any>;
}
