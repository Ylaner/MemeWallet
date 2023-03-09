import { Media } from "../models/mediaModel";
import { MyContext } from "../utils/myContextType";
import { createOne } from "./handlerFactory";

export const voiceHandler = async function (ctx: MyContext) {
  try {
    await createOne(ctx, Media, "voice");
  } catch (err) {
    console.log(err);
  }
};
