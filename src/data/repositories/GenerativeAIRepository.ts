import Song from "../../domain/entities/Song";
import StreamingSiteMetadata from "../../domain/entities/StreamingSiteMetadata";

export default interface GenerativeAIRepository {
  generateMetadataForFiles(files: string[]): Promise<Song[]>;
  generateMetadataForData(data: StreamingSiteMetadata, song?: Song): Promise<Song>;
}