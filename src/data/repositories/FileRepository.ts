export default interface FileRepository {
  getFileList(): Promise<string[]>;
}