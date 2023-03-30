import { Router } from "@grammyjs/router";
import { editHandler } from "../controllers/editControl";
import { MyContext } from "../utils/myContextType";

export const editRouter = function (router: Router<MyContext>) {
  try {
    const edit = router.route("edit");
    edit.chatType("private").on(":text", async (ctx) => await editHandler(ctx));
  } catch (err) {
    console.log(err);
  }
};
