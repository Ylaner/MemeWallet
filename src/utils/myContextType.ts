import { Context, SessionFlavor } from "@grammyjs/router/out/deps.node";
import { PhotoSize, Video } from "grammy/out/types.node";

interface SessionData {
  step: "idle" | "media" | "photo" | "video" | "edit"; // which step of the form we are on
  user?: number; //TODO: make user class
  photo?: PhotoSize[]; //TODO: make photo class
  video?: Video;
}
export type MyContext = Context & SessionFlavor<SessionData>;
