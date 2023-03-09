import { Router } from "@grammyjs/router";
import { voiceHandler } from "../controllers/voiceController";
import { MyContext } from "../utils/myContextType";

export const voiceRouter = function (router: Router<MyContext>) {
  try {
    const voice = router.route("voice");
    voice
      .chatType("private")
      .on(":text", async (ctx) => await voiceHandler(ctx));
  } catch (err) {
    console.log(err);
  }
};
