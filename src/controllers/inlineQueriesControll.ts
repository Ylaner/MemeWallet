import { Media } from "../models/mediaModel";
import { MyContext } from "../utils/myContextType";
import { VideoClass } from "../utils/videoClass";

export const inlineQueriesControll = async function (ctx: MyContext) {
  try {
    console.log("inlineQueriesControll triggerd");

    const query = ctx.update.inline_query?.query!;

    const arrayOfQuery = query.toLowerCase().split(" ");
    const Medias = await Media.find({
      index: { $all: arrayOfQuery },
      userId: ctx.update.inline_query?.from.id,
    });

    let i = 0;
    const replyMedias: any = Medias.map((media: any) => {
      i++;
      if (media.type === "video") {
        return new VideoClass(
          `Video ${i}`,
          media.index[0].charAt(0).toUpperCase() + media.index[0].slice(1),
          media.index.join(" "),
          media.mediaId
        );
      }
    });

    await ctx.answerInlineQuery(replyMedias, {
      cache_time: 10,
      is_personal: true,
      // next_offset: true,
    });
  } catch (err) {
    console.error(err);
  }
};
