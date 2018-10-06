var mongoose    = require("mongoose"),
    Country     = require("./models/country"),
    State       = require("./models/state"),
    Institution = require("./models/institution"),
    Building    = require("./models/building"),
    Floor       = require("./models/floor"),
    Room        = require("./models/room")

var data= [
  {
    name:"China"
  },  {
    name:"America"
  }
  ]
  
function seedDB(){
Country.remove({},function(err){
  if(err){
    console.log(err)
  }else{
   //add few countries
    data.forEach(function(seed){
      Country.create(seed,function(err,country){
        if(err){
          console.log(err)
        }else{
          console.log("added a country")
          //create states for each country
          State.create({
            name:"Wisconsin"
          },function(err,state){
            if(err){
              console.log(err)
            }else{
              country.states.push(state)
              country.save()
              console.log("created new state")
            }
          })
        }
      })
    })
  }
})
}

module.exports = seedDB