import { MyContext } from "../utils/myContextType";

export const createOne = async function (
  ctx: MyContext,
  Model: any,
  type: string
) {
  try {
    const message = ctx.message!;
    console.log(ctx.session.media);
    const index = message.text
      ?.toLowerCase()
      .replace(/(\r\n|\n|\r)/gm, " ")
      .split(" ")
      .filter((string) => string !== "");

    await Model.create({
      type: type,
      userId: message.from.id,
      mediaUniqueId: ctx.session.media?.file_unique_id,
      mediaId: ctx.session.media?.file_id,
      index: index,
    });
    ctx.session.step = "media";
    ctx.session.media = undefined;
    await ctx.reply(
      `Done, You can find it via inline method @MemeWallet_bot ${index}`,
      {
        reply_to_message_id: ctx.message?.message_id,
      }
    );
  } catch (err) {
    console.log(err);
  }
};
