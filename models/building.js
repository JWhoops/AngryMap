var mongoose = require("mongoose")

//utility schema -> building schema
var UtilitySchema = new mongoose.Schema({
  type: String, key:String, description:String});

//building schema config
var buildingSchema = new mongoose.Schema({
  name:String,//building name
  key:String, //key for this building
  created: {type:Date, default: Date.now},//created time
  //floors in building
  floors:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Floor"
    }
    ],
  lng:Number, //latitude
  lat:Number, //longtitude
  utilities:[UtilitySchema] //utility field
  
  // utilities:[
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref:"Utility"
  //   }
  //   ]
  
})
module.exports = mongoose.model("Building",buildingSchema)