var mongoose = require("mongoose")
//moongoose model config
var floorSchema = new mongoose.Schema({
  name:String,
  key:String
})
module.exports = mongoose.model("Floor",floorSchema)