import { MyContext } from "../utils/myContextType";

export const photoHandler = function (ctx: MyContext) {
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
  const message = ctx.message!;
  console.log(message.from);
  console.log(ctx.session.photo);
  ctx.session.step = "media";
  //TODO: save it on database
  ctx.session.photo = undefined;
};
