import { MyContext } from "../utils/myContextType";

export const mediaHandler = async (ctx: MyContext) => {
  try {
    console.log("media router triggered");
    const message = ctx.message!;
    const photo = message.photo;
    const video = message.video;
    const voice = message.voice;
    const video_note = message.video_note;
    if (photo !== undefined) {
      await ctx.reply("currently photos are not supported...");
      return;
      ctx.session.step = "photo";
      ctx.session.media = photo;
    } else if (video !== undefined) {
      ctx.session.step = "video";
      ctx.session.media = video;
    } else if (voice !== undefined) {
      ctx.session.step = "voice";
      ctx.session.media = voice;
    } else if (video_note !== undefined) {
      await ctx.reply("currently video messages are not supported...");
      return;
      ctx.session.step = "video_note";
      ctx.session.media = video_note;
    }
    await ctx.reply("Now send a index for this");
  } catch (err) {
    console.log(err);
  }
};
