var mongoose = require("mongoose")
//moongoose model config
var stateSchema = new mongoose.Schema({
  name:String,
  key:String
})
module.exports = mongoose.model("State",stateSchema)