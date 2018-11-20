var mongoose = require("mongoose")

//utility schema -> building schema
var UtilitySchema = new mongoose.Schema({
  type:String,description:String,image:String});

//building schema config
var buildingSchema = new mongoose.Schema({
  name:String,//building name
  key:String, //key for this building
  lng:Number, //latitude
  lat:Number, //longtitude
  utilities:[UtilitySchema], //utility field
  image:String
})
module.exports = mongoose.model("Building",buildingSchema)