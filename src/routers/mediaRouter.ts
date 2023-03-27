import { Router } from "@grammyjs/router";
import { mediaHandler } from "../controllers/mediaControl";
import { MyContext } from "../utils/myContextType";

export const mediaRouter = function (router: Router<MyContext>) {
  try {
    const media = router.route("media");
    media
      .chatType("private")
      .on(
        [":media", ":voice", ":video_note"],
        async (ctx) => await mediaHandler(ctx)
      );
  } catch (err) {
    console.log(err);
  }
};
