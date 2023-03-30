import { Context, SessionFlavor } from "@grammyjs/router/out/deps.node";
import { PhotoSize, Video } from "grammy/out/types.node";

export interface SessionData {
  step: "idle" | "media" | "photo" | "video" | "voice" | "video_note" | "edit"; // which step of the form we are on
  media?: any;
  user?: number; //TODO: make user class
}
export type MyContext = Context & SessionFlavor<SessionData>;
