import { Router } from "@grammyjs/router";
import { videoHandler } from "../controllers/videoController";
import { video_noteHandler } from "../controllers/viedo_noteControll";
import { MyContext } from "../utils/myContextType";

export const video_noteRouter = function (router: Router<MyContext>) {
  const video_note = router.route("video_note");
  video_note
    .chatType("private")
    .on(":text", async (ctx) => await video_noteHandler(ctx));
};
