var mongoose = require("mongoose")
//moongoose model config
var roomSchema = new mongoose.Schema({
  name:String,
  type: {type:String, default: 'room'},
  functionality: String,
  created: {type:Date, default: Date.now}
})
module.exports = mongoose.model("Room",roomSchema)
