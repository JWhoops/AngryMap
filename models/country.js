var mongoose = require("mongoose")
//moongoose model config
var countrySchema = new mongoose.Schema({
  name:String,
  key:String
})
module.exports = mongoose.model("Country",countrySchema)