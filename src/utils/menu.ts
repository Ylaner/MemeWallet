// import { Menu } from "@grammyjs/menu";
// import { MenuFlavor } from "@grammyjs/menu/out/menu";
// import { MyContext } from "./myContextType";

// // .text("EDIT", (ctx: any) => {})
// // .text("DELETE", (ctx) => ctx.reply("You pressed B!"))
// // .row()
// // .text("CANCEL", (ctx) => ctx.reply("You pressed c!"));

// const deleteAction = async (ctx: MyContext & MenuFlavor) => {
//   //Task 1 - Search for the media
//   const gif = await searchForGIF(newUser.userOnStage.details, newUser._id);
//   await gif.deleteOne();
//   newUser.userOnStage.stageName = ctx.stageEnums.GIF_SAVED;
//   newUser.userOnStage.details = "";
//   await ctx.user.updateOne(newUser);
//   await ctx.menu.close();
//   await ctx.editMessageText("Your GIF was deleted");
// };

// const cancelAction = async (ctx: MyContext & MenuFlavor) => {};

// const menuMaker = function (menuKey: string, buttonsArray: any) {
//   const menu = new Menu<MyContext>(menuKey);

//   if (buttonsArray != null)
//     buttonsArray.forEach((buttonObj: any) => {
//       menu.text(buttonObj.name, buttonObj.action);
//       if (buttonObj.hasRow === true) menu.row();
//     });

//   return menu;
// };

// export const menuCRUD = menuMaker("menuCRUD", [
//   {
//     name: "CANCEL",
//     hasRow: false,
//     action: async (ctx: any) => {
//       try {
//         await userAuth(ctx);
//         const newUser: UserData = ctx.user.toObject();
//         newUser.userOnStage.stageName = ctx.stageEnums.GIF_SAVED;
//         newUser.userOnStage.details = "";
//         await ctx.user.updateOne(newUser);
//         await ctx.menu.close();
//         await ctx.editMessageText("Canceled");
//       } catch (err) {
//         console.error(err);
//       }
//     },
//   },
// ]);
