import { youtube_v3 } from "@googleapis/youtube";
import StreamingSiteMetadata from "../../domain/entities/StreamingSiteMetadata";
import StreamingSiteRepository from "../repositories/StreamingSiteRepository";
import ytdl from "ytdl-core";
import Song from "../../domain/entities/Song";

export default class StreamingSiteDataSource implements StreamingSiteRepository {
  ytdl: typeof ytdl;

  constructor(downloader: typeof ytdl) {
    this.ytdl = downloader;
  }

  async getMetadataForUrl(url: string): Promise<StreamingSiteMetadata> {
    let info = await this.ytdl.getInfo(url)
    console.log(`media: ${JSON.stringify(info.videoDetails.media)}`)
    console.log(`video_url: ${info.videoDetails.video_url}`)
    let metadata: StreamingSiteMetadata = {
      name: info.videoDetails.title,
      url: info.videoDetails.video_url || url,
      title: info.videoDetails.media.song,
      artist: info.videoDetails.media.artist,
      thumbnail: info.videoDetails.thumbnails[0].url
    }
    console.log(`metadata: ${JSON.stringify(metadata)}`)
    return metadata;
  }

  async getMetadataForSong(song: Song): Promise<StreamingSiteMetadata> {
    // I just realized the file names of the downloaded songs already contain the youtube video id; formatted like this: `<video title> [<video id>].mp4`
    // So, I can just extract the video id from the file name, and use that to get the metadata from youtube
    const pattern = /\[(.*?)\]/g;
    let matches = song.source.match(pattern) || [];
    if (matches.length === 0) throw new Error('No item found!');
    let lastMatch = matches[matches.length - 1];
    let id = lastMatch.replace(/\[|\]/g, '');
    console.log(`id found: ${id}`)

    let info = await this.ytdl.getInfo(id)
    let metadata: StreamingSiteMetadata = {
      name: info.videoDetails.title,
      url: info.videoDetails.video_url,
      title: info.videoDetails.media.song,
      artist: info.videoDetails.media.artist,
      thumbnail: info.videoDetails.thumbnails[0].url
    }
    console.log(`metadata: ${metadata}`)
    return metadata;
  }
}