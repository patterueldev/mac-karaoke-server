import FileRepository from "../repositories/FileRepository";
import fs from 'fs';

export default class FileDataSource implements FileRepository {
  private directoryPath: string;
  constructor(directoryPath: string) {
    this.directoryPath = directoryPath;
  }

  async getFileList(): Promise<string[]> {
    return fs.readdirSync(this.directoryPath);
  }
}