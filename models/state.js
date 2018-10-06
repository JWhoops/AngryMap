var mongoose = require("mongoose")
//moongoose model config
var stateSchema = new mongoose.Schema({
  name:String,
  created: {type:Date, default: Date.now},
  institutions:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Institution"
    }
    ]
})
module.exports = mongoose.model("State",stateSchema)