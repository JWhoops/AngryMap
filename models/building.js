var mongoose = require("mongoose")
//moongoose model config
var buildingSchema = new mongoose.Schema({
  name:String,
  created: {type:Date, default: Date.now},
  floors:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Floor"
    }
    ]
})
module.exports = mongoose.model("Building",buildingSchema)