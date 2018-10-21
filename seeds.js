var mongoose    = require("mongoose"),
    Country     = require("./models/country"),
    State       = require("./models/state"),
    Institution = require("./models/institution"),
    Building    = require("./models/building"),
    Floor       = require("./models/floor"),
    Room        = require("./models/room")

//drop a collection
const dropC = (c) => {
  c.deleteOne({}, function(err) {if(!err)console.log('removed one collection')});
}

const screwBD = (bd) => {
  //drop all collections before inserting data----------------------------------
    dropC(Country)
    dropC(State)
    dropC(Institution)
    dropC(Building)
    dropC(Floor)
    dropC(Room)
  //----------------------------------------------------------------------------
    
    Country.create({name:"United States",key:"US"},(err,country)=>{
    if(!err){
     State.create({name:"Wisconsin",key:"WI"},(err,state)=>{
       if(!err){
         //associate state with country
          country.states.push(state)
          country.save()
          Institution.create({name:"University of Wisconsin-Madison",key:"UWM"},(err,institution)=>{
            if(!err){
              //associate institution with state
              state.institutions.push(institution)
              state.save()
              //data field======================================================
              Building.create({utilities:bd.utilities,
                                         lat:bd.lat,
                                         lng:bd.lng,
                                         name:bd.name,
                                         key:bd.key},
              //================================================================
                                         (err,building)=>{
                if(!err){
                  //associate building with institution
                  institution.buildings.push(building)
                  institution.save()
                  console.log("insert 1 data")
                }
              })
            }
          })  
       }
     }) 
    }
  })
}
  
function seedDB(){
  /*example
  how to insert a building object to database*/
  var utility = {type:"Microwave",description:"a microave in Rheta",picture:"www.asdfasdf.com/asdf.png"}
  screwBD({utilities:[utility],
         lat: 53.335,
         lng: 78.422,
         name: "Rheta",
         key: "RH"})
}

module.exports = seedDB