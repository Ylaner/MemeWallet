import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import { Bot, Context, session, SessionFlavor, webhookCallback } from "grammy";
import { Router } from "@grammyjs/router";
import { PhotoSize } from "grammy/out/types.node";
import { Video } from "grammy/out/types.node";
import { MongoDBAdapter, ISession } from "@grammyjs/storage-mongodb";
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
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
    interface SessionData {
      step: "idle" | "media" | "photo" | "video" | "edit"; // which step of the form we are on
      user?: number; //TODO: make user class
      photo?: PhotoSize[]; //TODO: make photo class
      video?: Video;
    }
    type MyContext = Context & SessionFlavor<SessionData>;
    const bot = new Bot<MyContext>(telegramToken);

    const sessions = conn.connection.db.collection<ISession>("session");
    bot.use(
      session({
        initial: (): SessionData => ({ step: "idle" }),
        storage: new MongoDBAdapter({ collection: sessions }),
      })
    ); // just run for new chats

    const router = new Router<MyContext>((ctx) => {
      console.log("router callback function triggerd");
      return ctx.session.step;
    });

    const media = router.route("media");
    media.chatType("private").on(":media", async (ctx) => {
      console.log("media router triggerd");
      console.log(ctx.message);
      const photo = ctx.message.photo;
      const video = ctx.message.video;
      if (photo !== undefined) {
        ctx.session.step = "photo";
        ctx.session.photo = photo;
      } else if (video !== undefined) {
        ctx.session.step = "video";
        ctx.session.video = video;
      }
      await ctx.reply("Now send a index for this");
    });

    const photo = router.route("photo");
    photo.chatType("private").on(":text", (ctx) => {
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
      console.log(ctx.message.from);
      console.log(ctx.session.photo);
      ctx.session.step = "media";
      //TODO: save it on database
      ctx.session.photo = undefined;
    });

    const video = router.route("video");
    video.chatType("private").on(":text", (ctx) => {
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
      console.log(ctx.message.from);
      console.log(ctx.session.video);
      ctx.session.step = "media";
      //TODO: save it on database
      ctx.session.video = undefined;
    });

    bot.command("start", async (ctx) => {
      console.log(`${ctx.session.step} from start command`);
      ctx.session.step = "media";
      await ctx.reply("Hello");
    });

    // Start the bot.
    if (process.env.NODE_ENV === "production") {
      // Use Webhooks for the production server
      app.use(express.json());
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
    process.exit(1);
  }
};

mainApp();
