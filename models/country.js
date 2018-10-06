var mongoose = require("mongoose")
//moongoose model config
var countrySchema = new mongoose.Schema({
  name:String,
  created: {type:Date, default: Date.now},
  states:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"State"
    }
    ]
})
module.exports = mongoose.model("Country",countrySchema)