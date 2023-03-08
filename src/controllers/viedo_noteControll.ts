import { Media } from "../models/mediaModel";
import { MyContext } from "../utils/myContextType";
import { createOne } from "./handlerFactory";

export const video_noteHandler = async function (ctx: MyContext) {
  await createOne(ctx, Media, "video_note");
};
