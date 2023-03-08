import { MediaClass } from "./mediaClass";

export class Video_noteClass extends MediaClass {
  private video_note_file_id: string;
  constructor(
    id: string,
    title: string,
    description: string,
    video_note_file_id: string
  ) {
    super("video_note", id, title, description);
    this.video_note_file_id = video_note_file_id;
  }
}
