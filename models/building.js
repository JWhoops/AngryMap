var mongoose = require("mongoose")

//utility schema -> building schema
var UtilitySchema = new mongoose.Schema({
  type: String, key:String, description:String});

//building schema config
var buildingSchema = new mongoose.Schema({
  name:String,//building name
  key:String, //key for this building
  lng:Number, //latitude
  lat:Number, //longtitude
  utilities:[UtilitySchema] //utility field
})
module.exports = mongoose.model("Building",buildingSchema)