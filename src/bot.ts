import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import { Bot, session, webhookCallback } from "grammy";
import { Router } from "@grammyjs/router";
import { MongoDBAdapter, ISession } from "@grammyjs/storage-mongodb";
import { mediaRouter } from "./routers/mediaRouter";
import { photoRouter } from "./routers/photoRouter";
import { videoRouter } from "./routers/videoRouter";
import { inlineQueriesControl } from "./controllers/inlineQueriesControl";
import { MyContext, SessionData } from "./utils/myContextType";
import { voiceRouter } from "./routers/voiceRouter";
import { video_noteRouter } from "./routers/video_noteRouter";
import { editRouter } from "./routers/editRouter";
import {
  addControl,
  cancelControl,
  deleteControl,
  helpControlGroups,
  helpControlPrivate,
  startControl,
} from "./controllers/commandControl";
import { helpMessageGroup } from "./controllers/handlerFactory";

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
    bot.on("inline_query", async (ctx) => inlineQueriesControl(ctx));
    await bot.api.setMyCommands([
      { command: "start", description: "Start the bot" },
      { command: "help", description: "Show the help text" },
      { command: "add", description: "add a new media only for groups" },
      { command: "delete", description: "delete the target media" },
      { command: "cancel", description: "cancel the current operation" },
    ]);

    bot.on(":new_chat_members:me", async (ctx) => helpMessageGroup(ctx));
    bot.command("add", async (ctx: MyContext) => await addControl(ctx));
    bot
      .chatType("private")
      .command("help", async (ctx: MyContext) => await helpControlPrivate(ctx));
    bot
      .chatType("group")
      .command("help", async (ctx: MyContext) => await helpControlGroups(ctx));

    const sessions = conn.connection.db.collection<ISession>("session");
    bot.use(
      session({
        initial: (): SessionData => ({ step: "idle" }), // just run for new chats
        storage: new MongoDBAdapter({ collection: sessions }),
      })
    ); // just run for new chats
    bot.command("start", async (ctx) => await startControl(ctx));

    bot
      .chatType("private")
      .command("cancel", async (ctx: MyContext) => await cancelControl(ctx));
    bot
      .chatType("private")
      .command("delete", async (ctx: MyContext) => await deleteControl(ctx));

    const router = new Router<MyContext>((ctx) => {
      console.log("router callback function triggered");
      return ctx.session.step;
    });

    mediaRouter(router);
    photoRouter(router);
    videoRouter(router);
    voiceRouter(router);
    video_noteRouter(router); // video messages
    editRouter(router);

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
