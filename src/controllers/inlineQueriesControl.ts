import { Media } from "../models/mediaModel";
import { MyContext } from "../utils/myContextType";
import { VideoClass } from "../utils/videoClass";
// import { Video_noteClass } from "../utils/video_noteClass";
import { VoiceClass } from "../utils/voiceClass";

export const inlineQueriesControl = async function (ctx: MyContext) {
  try {
    console.log("inlineQueriesControl triggered");

    const query = ctx.update.inline_query?.query!;

    const arrayOfQuery = query
      ?.toLowerCase()
      .replace(/(\r\n|\n|\r)/gm, " ")
      .split(" ")
      .filter((string) => string !== "");
    console.log(arrayOfQuery, ctx.update.inline_query?.from.id);
    const medias = await Media.find({
      index: { $all: arrayOfQuery },
      userId: ctx.update.inline_query?.from.id,
    });
    console.log(medias);

    let i = 0;
    const replyMedias: any = medias.map((media: any) => {
      i++;
      if (media.type === "video") {
        return new VideoClass(
          `Video ${i}`,
          media.index.join(" "),
          media.index.join(" "),
          media.mediaId
        );
      }
      if (media.type === "voice") {
        return new VoiceClass(
          `Voice ${i}`,
          media.index.join(" "),
          media.index.join(" "),
          media.mediaId
        );
      }
      // if (media.type === "video_note") {
      //   return new Video_noteClass(
      //     `Video_note ${i}`,
      //     media.index.join(" "),
      //     media.index.join(" "),
      //     media.mediaId
      //   );
      // }
    });
    const option: any = {
      cache_time: 10,
      is_personal: true,
      // next_offset: "next",
    };
    if (!replyMedias[0]) {
      option.switch_pm_text = "No result found. Start a bot for saving a media";
      option.switch_pm_parameter = "-";
    }
    console.log(`option: ${option}`);
    await ctx.answerInlineQuery(replyMedias, option);
  } catch (err) {
    console.error(err);
  }
};
