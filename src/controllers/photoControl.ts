import { Media } from "../models/mediaModel";
import { MyContext } from "../utils/myContextType";

export const photoHandler = async function (ctx: MyContext) {
  try {
    // photo: [
    //   {
    //     file_id: 'AgACAgEAAxkBAAIC8WQDVxoxH0efxyI64513xckOcj5CAALiqjEbaXIZRBdcY33CxzQ2AQADAgADcwADLgQ',
    //     file_unique_id: 'AQAD4qoxG2lyGUR4',
    //     file_size: 953,
    //     width: 90,
    //     height: 51
    //   },
    //   {
    //     file_id: 'AgACAgEAAxkBAAIC8WQDVxoxH0efxyI64513xckOcj5CAALiqjEbaXIZRBdcY33CxzQ2AQADAgADbQADLgQ',
    //     file_unique_id: 'AQAD4qoxG2lyGURy',
    //     file_size: 13001,
    //     width: 320,
    //     height: 180
    //   },
    //   {
    //     file_id: 'AgACAgEAAxkBAAIC8WQDVxoxH0efxyI64513xckOcj5CAALiqjEbaXIZRBdcY33CxzQ2AQADAgADeAADLgQ',
    //     file_unique_id: 'AQAD4qoxG2lyGUR9',
    //     file_size: 58049,
    //     width: 800,
    //     height: 449
    //   },
    //   {
    //     file_id: 'AgACAgEAAxkBAAIC8WQDVxoxH0efxyI64513xckOcj5CAALiqjEbaXIZRBdcY33CxzQ2AQADAgADeQADLgQ',
    //     file_unique_id: 'AQAD4qoxG2lyGUR-',
    //     file_size: 102551,
    //     width: 1280,
    //     height: 719
    //   }
    // ]
    const message = ctx.message!;
    const photoUniqueId = ctx.session.media?.map((photo: any) => {
      return photo.file_unique_id;
    })!;
    const photoId = ctx.session.media?.map((photo: any) => {
      return photo.file_id;
    })!;
    const index = message.text?.split(" ");

    ctx.session.step = "media";
    //TODO: save it on database
    await Media.create({
      type: "photo",
      userId: message.from.id,
      mediaUniqueId: photoUniqueId[0],
      mediaId: photoId[0],
      index: index,
    });
    ctx.session.media = undefined;
  } catch (err) {
    console.log(err);
  }
};
