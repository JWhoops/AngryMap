var mongoose = require("mongoose")
//moongoose model config
var institutionSchema = new mongoose.Schema({
  name:String,
  created: {type:Date, default: Date.now},
  buildings:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Building"
    }
    ]
})
module.exports = mongoose.model("Institution",institutionSchema)