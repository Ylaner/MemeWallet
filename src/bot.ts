import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import { Bot, Context, session, SessionFlavor, webhookCallback } from "grammy";
import { Router } from "@grammyjs/router";
import { MongoDBAdapter, ISession } from "@grammyjs/storage-mongodb";
import { mediaRouter } from "./routers/mediaRouter";
import { photoRouter } from "./routers/photoRouter";
import { videoRouter } from "./routers/videoRouter";
import { inlineQueriesControll } from "./controllers/inlineQueriesControll";
import { MyContext, SessionData } from "./utils/myContextType";
import { voiceRouter } from "./routers/voiceRouter";
import { video_noteRouter } from "./routers/video_noteRouter";
import { Media } from "./models/mediaModel";

dotenv.config({ path: "./config.env" });
const app = express();
const PORT = process.env.PORT || 8443;
const telegramToken = process.env.TELEGRAM_API_TOKEN!;
const envDatabase = process.env.DATABASE!;
const DB = envDatabase;
mongoose.set("strictQuery", true);

const mainApp = async () => {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const bot = new Bot<MyContext>(telegramToken);
    bot.on("inline_query", async (ctx) => inlineQueriesControll(ctx));
    bot.command("start", async (ctx) => {
      console.log(`${ctx.session.step} from start command`);
      ctx.session.step = "media";
      await ctx.reply("Hello");
    });

    bot.command("add", async (ctx) => {
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
        //Task 3 - Check the user reply on a media suppurted
        const photo = message.reply_to_message.photo;
        const video = message.reply_to_message.video;
        const voice = message.reply_to_message.voice;
        const video_note = message.reply_to_message.video_note;
        let type;
        let media;
        if (photo !== undefined) {
          await ctx.reply("curently photos are not supported...", {
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
          await ctx.reply("curently video messages are not supported...", {
            reply_to_message_id: ctx.message?.message_id,
          });
          return;
        }
        //Task 4 - Check the user enter a valid key
        let index;
        index = message.text.split("/add ")[1]?.split(" ");
        if (!index) {
          await ctx.reply("please send your index after /add");
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
    });
    const sessions = conn.connection.db.collection<ISession>("session");
    bot.use(
      session({
        initial: (): SessionData => ({ step: "idle" }), // just run for new chats
        storage: new MongoDBAdapter({ collection: sessions }),
      })
    ); // just run for new chats

    const router = new Router<MyContext>((ctx) => {
      console.log("router callback function triggerd");
      return ctx.session.step;
    });

    mediaRouter(router);
    photoRouter(router);
    videoRouter(router);
    voiceRouter(router);
    video_noteRouter(router);

    // Start the bot.
    if (process.env.NODE_ENV === "production") {
      // Use Webhooks for the production server
      app.use(express.json());
      bot.use(router); // register the router
      app.use(webhookCallback(bot, "express"));
      app.listen(PORT, () => {
        console.log(`listening for requests on port: ${PORT}`);
      });
    } else {
      // Use Long Polling for development
      bot.use(router); // register the router
      bot.start();
    }
  } catch (error) {
    console.log(error);
  }
};

mainApp();
