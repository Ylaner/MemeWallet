import { Router } from "@grammyjs/router";
import { videoHandler } from "../controllers/videoController";
import { MyContext } from "../utils/myContextType";

export const videoRouter = function (router: Router<MyContext>) {
  const video = router.route("video");
  video.chatType("private").on(":text", async (ctx) => await videoHandler(ctx));
};
