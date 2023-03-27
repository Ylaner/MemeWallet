import { Router } from "@grammyjs/router";
import { video_noteHandler } from "../controllers/viedo_noteControl";
import { MyContext } from "../utils/myContextType";

export const video_noteRouter = function (router: Router<MyContext>) {
  try {
    const video_note = router.route("video_note");
    video_note
      .chatType("private")
      .on(":text", async (ctx) => await video_noteHandler(ctx));
  } catch (err) {
    console.log(err);
  }
};
