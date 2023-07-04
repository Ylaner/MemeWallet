import { ObjectId } from "mongoose";
import { Media } from "../models/mediaModel";
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
      `Done, You can find it via inline method @MemeWallet_bot ${index?.join(
        " "
      )}`,
      {
        reply_to_message_id: ctx.message?.message_id,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const findOne = async (filter: object, Model: any) => {
  try {
    const query = await Model.findOne(filter);
    return query;
  } catch (err) {
    console.log(err);
  }
};

export const deleteOne = async (filter: object, Model: any) => {
  try {
    await Model.deleteOne(filter);
  } catch (err) {
    console.log(err);
  }
};

export const updateOne = async (filter: object, data: any, Model: any) => {
  try {
    const updatedData = await Model.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    });
    console.log(updatedData);
  } catch (err) {
    console.log(err);
  }
};

export const clearSession = (ctx: MyContext) => {
  ctx.session.step = "media";
  ctx.session.media = null;
};

export const helpMessagePrivate = async (ctx: MyContext) => {
  await ctx.reply(
    "You can save your videos and voices to the bot and access it later through the inline method like this: '@MemeWallet_bot {your index}', send your video or voice first"
  );
};

export const helpMessageGroup = async (ctx: MyContext) => {
  await ctx.reply(
    "Reply '/add your index' to the media you want to saved(Video and Voice message) to save it on the bot and use inline method @MemeWallet_bot to access it later. Don't forget i must be ADMIN to work properly"
  );
};
