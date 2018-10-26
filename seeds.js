var mongoose    = require("mongoose"),
    Country     = require("./models/country"),
    State       = require("./models/state"),
    Institution = require("./models/institution"),
    Building    = require("./models/building"),
    Floor       = require("./models/floor"),
    Room        = require("./models/room")

//drop a collection
const dropC = (c) => {
  c.remove({}, function(err) {if(!err)console.log('removed one collection')});
}

const insertBuildings = (bds) => {
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
     State.create({name:"Wisconsin",key:"WISC"},(err,state)=>{
       if(!err){
         //associate state with country
          country.states.push(state)
          country.save()
          Institution.create({name:"University of Wisconsin-Madison",key:"UWMAD"},(err,institution)=>{
            if(!err){
              //associate institution with state
              state.institutions.push(institution)
              state.save()
              bds.forEach((building)=>{
                    //insert building into db
                              Building.create({utilities:building.utilities,
                                         //coordinates是反过来的
                                         lat:building.coordinates[1],
                                         lng:building.coordinates[0],
                                         name:building.name,
                                         key:building.key},
                                         (err,building)=>{
                if(!err){
                  //associate building with institution
                  institution.buildings.push(building)
                  institution.save()
                  console.log("created: " + building.name)
                  }
                })
              })
            }
          })  
       }
     }) 
    }
  })
}

// Read Asynchrously
 const getJsonObj = (path) => { 
  var fs = require("fs");
  console.log("\n *START READING JSON* \n");
  var content = JSON.parse(fs.readFileSync(path));
  return content;
 }

const seedDB =()=>{
  //read buildings and microwaves json files
  let buildings =  getJsonObj('./test_jsons/buildings.json').buildings
  let microwaves = getJsonObj('./test_jsons/Microwaves.json').microwaves
  
  buildings.forEach((building)=>{
    let utility = []
    microwaves.forEach((microwave)=>{
      if(building.key === microwave.key){
        //push utilites into building's utilities array using same key
        utility.push(microwave)
      }
    })
    building.utilities = utility //assign utility to buildings
    })
    insertBuildings(buildings) //insert building list into database
  }
  


module.exports = seedDB