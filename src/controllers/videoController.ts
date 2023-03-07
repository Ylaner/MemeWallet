import { Media } from "../models/mediaModel";
import { MyContext } from "../utils/myContextType";

export const videoHandler = async function (ctx: MyContext) {
  // video: {
  //   duration: 10,
  //   width: 748,
  //   height: 854,
  //   mime_type: 'video/mp4',
  //   thumb: {
  //     file_id: 'AAMCBAADGQEAAgMCZAN0DEFqlBZWF3BSil-zZWKpXhcAApYNAALAViFQg3In5oTSfrIBAAdtAAMuBA',
  //     file_unique_id: 'AQADlg0AAsBWIVBy',
  //     file_size: 18095,
  //     width: 280,
  //     height: 320
  //   },
  //   file_id: 'BAACAgQAAxkBAAIDAmQDdAxBapQWVhdwUopfs2ViqV4XAAKWDQACwFYhUINyJ-aE0n6yLgQ',
  //   file_unique_id: 'AgADlg0AAsBWIVA',
  //   file_size: 1303699
  // }

  const message = ctx.message!;
  console.log(message.from);
  console.log(ctx.session.video);
  const index = message.text?.split(" ");
  console.log(index);

  await Media.create({
    type: "video",
    userId: message.from.id,
    mediaUniqueId: ctx.session.video?.file_unique_id,
    mediaId: ctx.session.video?.file_id,
    index: index,
  });
  ctx.session.step = "media";
  ctx.session.video = undefined;
};
