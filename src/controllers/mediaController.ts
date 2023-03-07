import { MyContext } from "../utils/myContextType";

export const mediaHandler = async (ctx: MyContext) => {
  console.log("media router triggerd");
  const message = ctx.message!;
  const photo = message.photo;
  const video = message.video;
  if (photo !== undefined) {
    await ctx.reply("curently photo save manager is offline...");
    return;
    ctx.session.step = "photo";
    ctx.session.photo = photo;
  } else if (video !== undefined) {
    ctx.session.step = "video";
    ctx.session.video = video;
  }
  await ctx.reply("Now send a index for this");
};
