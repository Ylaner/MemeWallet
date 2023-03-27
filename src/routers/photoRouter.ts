import { Router } from "@grammyjs/router";
import { photoHandler } from "../controllers/photoControl";
import { MyContext } from "../utils/myContextType";

export const photoRouter = function (router: Router<MyContext>) {
  try {
    const photo = router.route("photo");
    photo
      .chatType("private")
      .on(":text", async (ctx) => await photoHandler(ctx));
  } catch (err) {
    console.log(err);
  }
};
