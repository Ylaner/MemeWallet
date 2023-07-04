import { Media } from "../models/mediaModel";
import { MyContext } from "../utils/myContextType";
import {
  clearSession,
  deleteOne,
  findOne,
  helpMessageGroup,
  helpMessagePrivate,
} from "./handlerFactory";

export const addControl = async (ctx: MyContext) => {
  try {
    //Task 1 - Just for groups
    const message = ctx.message!;
    if (message.chat.type === "private") {
      await ctx.reply("This commend is only for the groups.", {
        reply_to_message_id: ctx.message?.message_id,
      });
      return;
    }
    //Task 2 - Check the user reply on message
    if (!message.reply_to_message) {
      await ctx.reply("Please reply on a media.", {
        reply_to_message_id: ctx.message?.message_id,
      });
      return;
    }
    //Task 3 - Check the user reply on a media supported
    const photo = message.reply_to_message.photo;
    const video = message.reply_to_message.video;
    const voice = message.reply_to_message.voice;
    const video_note = message.reply_to_message.video_note;
    let type;
    let media;
    const mediaUniqueId = video?.file_unique_id || voice?.file_unique_id;
    const mediaOnDatabase = await findOne(
      { mediaUniqueId, userId: ctx.from?.id },
      Media
    );

    if (mediaOnDatabase) {
      await ctx.reply(
        `You saved this media before with this index: ${mediaOnDatabase.index.join(
          " "
        )} You can edit or delete this media in the bot`,
        {
          reply_to_message_id: ctx.message?.message_id,
        }
      );
      return;
    }

    if (photo !== undefined) {
      await ctx.reply("currently photos are not supported...", {
        reply_to_message_id: ctx.message?.message_id,
      });
      return;
    } else if (video !== undefined) {
      type = "video";
      media = video;
    } else if (voice !== undefined) {
      type = "voice";
      media = voice;
    } else if (video_note !== undefined) {
      await ctx.reply("currently video messages are not supported...", {
        reply_to_message_id: ctx.message?.message_id,
      });
      return;
    }
    //Task 4 - Check the user enter a valid key
    let index;
    index = message
      .text!.split("/add ")[1]
      ?.toLowerCase()
      .replace(/(\r\n|\n|\r)/gm, " ")
      .split(" ")
      .filter((string) => string !== "");
    if (!index) {
      await ctx.reply("please send your index after /add", {
        reply_to_message_id: ctx.message?.message_id,
      });
      return;
    }
    //Task 5 - Save the media on database
    await Media.create({
      type: type,
      userId: message.from.id,
      mediaUniqueId: media?.file_unique_id,
      mediaId: media?.file_id,
      index: index,
    });
    await ctx.reply("Done", {
      reply_to_message_id: ctx.message?.message_id,
    });
  } catch (err) {
    console.error(err);
  }
};

export const startControl = async (ctx: MyContext) => {
  try {
    console.log(`${ctx.session.step} from start command`);
    ctx.session.step = "media";
    await ctx.reply("Hello");
    await helpMessagePrivate(ctx);
  } catch (err) {
    console.log(err);
  }
};

export const cancelControl = async (ctx: MyContext) => {
  try {
    clearSession(ctx);
    await ctx.reply("The operation is canceled");
  } catch (err) {
    console.log(err);
  }
};

export const deleteControl = async (ctx: MyContext) => {
  try {
    if (ctx.session.step == "edit") {
      await deleteOne({ _id: ctx.session.media._id }, Media);
      await ctx.reply("The media is deleted");
      clearSession(ctx);
    }
  } catch (err) {
    console.log(err);
  }
};

export const helpControlPrivate = async (ctx: MyContext) => {
  try {
    await helpMessagePrivate(ctx);
  } catch (err) {
    console.log(err);
  }
};

export const helpControlGroups = async (ctx: MyContext) => {
  try {
    await helpMessageGroup(ctx);
  } catch (err) {
    console.log(err);
  }
};
