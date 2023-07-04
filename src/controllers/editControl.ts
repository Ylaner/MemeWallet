import { Media } from "../models/mediaModel";
import { MyContext } from "../utils/myContextType";
import { clearSession, updateOne } from "./handlerFactory";

export const editHandler = async (ctx: MyContext) => {
  try {
    console.log("edit handler triggered");

    const query = ctx.message?.text;

    const arrayOfQuery = query
      ?.toLowerCase()
      .replace(/(\r\n|\n|\r)/gm, " ")
      .split(" ")
      .filter((string) => string !== "");

    const data = ctx.session.media;
    console.log(arrayOfQuery);
    data.index = arrayOfQuery;
    await updateOne({ _id: data._id }, data, Media);
    clearSession(ctx);
  } catch (err) {
    console.log(err);
  }
};

export const editControl = async (ctx: MyContext, mediaOnDatabase: any) => {
  if (mediaOnDatabase) {
    await ctx.reply(
      `You saved this media before with this index: ${mediaOnDatabase.index.join(
        " "
      )} If you want to edit the index just send a new one, else delete that with /delete, None of them use /cancel`
    );
    ctx.session.step = "edit";
    ctx.session.media = mediaOnDatabase;
  }
};
