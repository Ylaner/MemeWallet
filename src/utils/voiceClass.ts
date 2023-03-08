import { MediaClass } from "./mediaClass";

export class VoiceClass extends MediaClass {
  private voice_file_id: string;
  constructor(
    id: string,
    title: string,
    description: string,
    voice_file_id: string
  ) {
    super("voice", id, title, description);
    this.voice_file_id = voice_file_id;
  }
}
