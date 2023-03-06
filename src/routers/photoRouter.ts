import { Router } from "@grammyjs/router";
import { photoHandler } from "../controllers/photoController";
import { MyContext } from "../utils/myContextType";

export const photoRouter = function (router: Router<MyContext>) {
  const photo = router.route("photo");
  photo.chatType("private").on(":text", async (ctx) => await photoHandler(ctx));
};
