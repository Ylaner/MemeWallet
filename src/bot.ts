import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import { Bot, Context, session, SessionFlavor, webhookCallback } from "grammy";
import { Router } from "@grammyjs/router";
import { PhotoSize } from "grammy/out/types.node";
import { Video } from "grammy/out/types.node";
import { MongoDBAdapter, ISession } from "@grammyjs/storage-mongodb";
import { mediaRouter } from "./routers/mediaRouter";
import { photoRouter } from "./routers/photoRouter";
import { videoRouter } from "./routers/videoRouter";
import { inlineQueriesControll } from "./controllers/inlineQueriesControll";

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
