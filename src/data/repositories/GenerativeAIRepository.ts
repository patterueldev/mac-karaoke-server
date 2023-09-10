import Song from "../../domain/entities/Song";

export default interface GenerativeAIRepository {
  generateMetadataForFiles(files: string[]): Promise<Song[]>;
}