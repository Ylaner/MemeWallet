import { Router } from "@grammyjs/router";
import { mediaHandler } from "../controllers/mediaController";
import { MyContext } from "../utils/myContextType";

export const mediaRouter = function (router: Router<MyContext>) {
  const media = router.route("media");
  media
    .chatType("private")
    .on(":media", async (ctx) => await mediaHandler(ctx));
};
