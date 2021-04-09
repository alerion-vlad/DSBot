import mongoose from "mongoose";

const Guild = new mongoose.Schema({
  id: String,
  prefix: String,
});

export default mongoose.model("Guild", Guild);
