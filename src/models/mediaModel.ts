import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Media must has type"],
  },
  mediaUniqueId: {
    type: String,
    required: [true, "Media must has mediaUniqueId"],
  },
  mediaId: {
    type: String,
    required: [true, "Media must has mediaId"],
  },
  userId: {
    type: Number,
    required: [true, "Media must belong to a userId"],
  },
  index: [String],
});
mediaSchema.index({ userId: 1, index: 1 });

export const Media = mongoose.model("media", mediaSchema);
