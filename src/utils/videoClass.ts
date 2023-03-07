import { MediaClass } from "./mediaClass";

export class VideoClass extends MediaClass {
  private video_file_id: string;
  constructor(
    id: string,
    title: string,
    description: string,
    video_file_id: string
  ) {
    super("video", id, title, description);
    this.video_file_id = video_file_id;
  }
}