import { Bot, Context, Keyboard, session, SessionFlavor } from "grammy";
import { Router } from "@grammyjs/router";

interface SessionData {
  step: "idle" | "day" | "month"; // which step of the form we are on
  dayOfMonth?: number; // day of birthday
  month?: number; // month of birthday
}
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>("");

// Use session.
bot.use(session({ initial: (): SessionData => ({ step: "idle" }) }));

// Define some commands.
bot.command("start", async (ctx) => {
  await ctx.reply(`Welcome!
I can tell you in how many days it is your birthday!
Send /birthday to start`);
});

bot.command("birthday", async (ctx) => {
  const day = ctx.session.dayOfMonth;
  const month = ctx.session.month;
  if (day !== undefined && month !== undefined) {
    // Information already provided!
    await ctx.reply(`Your birthday is in ${getDays(month, day)} days!`);
  } else {
    // Missing information, enter router-based form
    ctx.session.step = "day";
    await ctx.reply(
      "Please send me the day of month \
of your birthday as a number!"
    );
  }
});

// Use router.
const router = new Router<MyContext>((ctx) => ctx.session.step);

// Define step that handles the day.
const day = router.route("day");
day.on("message:text", async (ctx) => {
  const day = parseInt(ctx.msg.text, 10);
  if (isNaN(day) || day < 1 || 31 < day) {
    await ctx.reply("That is not a valid day, try again!");
    return;
  }
  ctx.session.dayOfMonth = day;
  // Advance form to step for month
  ctx.session.step = "month";
  await ctx.reply("Got it! Now, send me the month!", {
    reply_markup: {
      one_time_keyboard: true,
      keyboard: new Keyboard()
        .text("Jan")
        .text("Feb")
        .text("Mar")
        .row()
        .text("Apr")
        .text("May")
        .text("Jun")
        .row()
        .text("Jul")
        .text("Aug")
        .text("Sep")
        .row()
        .text("Oct")
        .text("Nov")
        .text("Dec")
        .build(),
    },
  });
});
day.use((ctx) => ctx.reply("Please send me the day as a text message!"));

// Define step that handles the month.
const month = router.route("month");
month.on("message:text", async (ctx) => {
  // Should not happen, unless session data is corrupted.
  const day = ctx.session.dayOfMonth;
  if (day === undefined) {
    await ctx.reply("I need your day of month!");
    ctx.session.step = "day";
    return;
  }

  const month = months.indexOf(ctx.msg.text);
  if (month === -1) {
    await ctx.reply(
      "That is not a valid month, \
please use one of the buttons!"
    );
    return;
  }

  ctx.session.month = month;
  const diff = getDays(month, day);
  await ctx.reply(
    `Your birthday is on ${months[month]} ${day}.
That is in ${diff} days!`,
    { reply_markup: { remove_keyboard: true } }
  );
  ctx.session.step = "idle";
});
month.use((ctx) => ctx.reply("Please tap one of the buttons!"));

// Define step that handles all other cases.
router.otherwise(async (ctx) => {
  // idle
  await ctx.reply("Send /birthday to find out how long you have to wait.");
});

bot.use(router); // register the router
bot.start();

// Date conversion utils
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function getDays(month: number, day: number) {
  const bday = new Date();
  const now = Date.now();
  bday.setMonth(month);
  bday.setDate(day);
  if (bday.getTime() < now) bday.setFullYear(bday.getFullYear() + 1);
  const diff = (bday.getTime() - now) / (1000 * 60 * 60 * 24);
  return diff;
}
