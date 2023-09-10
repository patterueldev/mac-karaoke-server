import Song from "../../domain/entities/Song";
import StreamingSiteMetadata from "../../domain/entities/StreamingSiteMetadata";

export default interface StreamingSiteRepository {
  getMetadataForUrl(url: string): Promise<StreamingSiteMetadata>;
  getMetadataForSong(song: Song): Promise<StreamingSiteMetadata>;
}