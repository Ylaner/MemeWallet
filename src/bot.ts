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

    bot.command("start", async (ctx) => {
      console.log(`${ctx.session.step} from start command`);
      ctx.session.step = "media";
      await ctx.reply("Hello");
    });

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
