export class MediaClass {
  private type: string;
  private id: string;
  private title: string;
  private description: string;

  constructor(type: string, id: string, title: string, description: string) {
    this.type = type;
    this.id = id;
    this.title = title;
    this.description = description;
  }
}
