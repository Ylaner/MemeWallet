import { Media } from "../models/mediaModel";
import { MyContext } from "../utils/myContextType";
import { createOne } from "./handlerFactory";

export const videoHandler = async function (ctx: MyContext) {
  try {
    await createOne(ctx, Media, "video");
  } catch (err) {
    console.log(err);
  }
};
