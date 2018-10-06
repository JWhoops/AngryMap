var mongoose = require("mongoose")
//moongoose model config
var floorSchema = new mongoose.Schema({
  name:String,
  created: {type:Date, default: Date.now},
  rooms:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Floor"
    }
    ]
})
module.exports = mongoose.model("Floor",floorSchema)