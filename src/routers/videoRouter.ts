import { Router } from "@grammyjs/router";
import { videoHandler } from "../controllers/videoControl";
import { MyContext } from "../utils/myContextType";

export const videoRouter = function (router: Router<MyContext>) {
  try {
    const video = router.route("video");
    video
      .chatType("private")
      .on(":text", async (ctx) => await videoHandler(ctx));
  } catch (err) {
    console.log(err);
  }
};
