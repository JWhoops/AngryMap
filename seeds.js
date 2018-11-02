var mongoose    = require("mongoose"),
    Country     = require("./models/country"),
    State       = require("./models/state"),
    Institution = require("./models/institution"),
    Building    = require("./models/building"),
    Floor       = require("./models/floor"),
    Room        = require("./models/room")

const createBuildings = (bds) => {
    var US = new Country({
        _id: new mongoose.Types.ObjectId(),
        name: "United States",
        key: "US",
    })  
    var WISC = new State({
        _id: new mongoose.Types.ObjectId(),
        name: "Wisconsin",
        key: "WISC",
      })
    US.states.push(WISC._id)
    var UWMADISON = new Institution({
      _id: new mongoose.Types.ObjectId(),
      name:"University of Wisconsin-Madison",
      key:"UWMAD"
    })
    WISC.institutions.push(UWMADISON._id)
    bds.forEach(function(bd){
      var bd = new Building({_id: new mongoose.Types.ObjectId(),
                            utilities:bd.utilities,
                            //coordinates是反过来的
                            lat:bd.coordinates[1],
                            lng:bd.coordinates[0],
                            name:bd.name,
                            key:bd.key})
      UWMADISON.buildings.push(bd._id)
      bd.save(function(err){if(err) console.log(err)})
    })
    US.save(function(err){
      if(err) console.log(err)
      console.log("save country")
    })
    WISC.save(function(err){
      if(err) console.log(err)
        console.log("save a state")
      })
    UWMADISON.save(function(err){
      if(err) console.log(err)
        console.log("save a institution")
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
  let printers = getJsonObj('./test_jsons/Printers.json').printers
  
  buildings.forEach((building)=>{
    let utility = []
    microwaves.forEach((microwave)=>{
      if(building.key === microwave.key){
        //push utilites into building's utilities array using same key
        utility.push(microwave)
      }
    })
    printers.forEach((printer)=>{
      if(building.key === printer.key){
        //push utilites into building's utilities array using same key
        utility.push(printer)
      }
    })
    building.utilities = utility //assign utility to buildings
    })
    createBuildings(buildings) //insert building list into database
  }

//obj format:
// {
//   countryName:countryName:,
//   countryKey:countryKey,
//   stateName:stateName:,
//   stateKey:stateKey,
//   institutionName:institutionName:,
//   institutionKey:institutionKey,
//   buildingName:buildingName:,
//   buildingKey:buildingKey,
//   buildingUtilities:buildingUtilities
//....and other fields so on
// }
function insertOne(obj, level){
  for (var i = 0; i <= level; i++) {
    switch(level){
      case 0: 
        Country.findOne({name: obj.country.name},(err,fCountry)=>{
          if(!err){
            if(!fCountry){
              var country = new Country(obj.country)
              country.save()
            }
          }
        })
        break
      case 1:
        State.findOne({name:obj.state.name},(err,fState)=>{
          if(!err){
            if(!fState){
              var state = new State(obj.state)
              state.save()
            }
          }
        })
        break
      case 2:
        Institution.findOne({name:obj.institution.name},(err,fInstitution)=>{
          if(!err){
            if(!fInstitution){
              var institution = new Institution(obj.institution)
              institution.save()
            }
          }
        })
        break
      case 3:
        Building.findOne({name:obj.building.name},(err,fBuilding)=>{
          if(!err){
            if(!fBuilding){
              var building = new Building(obj.building)
              building.save()
            }
          }
        })
    }
  }
}

const create = (obj,schema)=>{
    var createdObj = new schema(obj)
    return createdObj
}

module.exports = seedDB