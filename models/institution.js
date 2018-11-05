var mongoose = require("mongoose")
//moongoose model config
var institutionSchema = new mongoose.Schema({
  name:String,
  key:String
})
module.exports = mongoose.model("Institution",institutionSchema)