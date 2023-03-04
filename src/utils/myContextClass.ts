import { Context, SessionFlavor } from "@grammyjs/router/out/deps.node";

interface SessionData {
  step: "idle" | "media" | "index" | "edit"; // which step of the form we are on
  user?: number; // user object
  media?: number; // media object
}

type MyContext = Context & SessionFlavor<SessionData>;
