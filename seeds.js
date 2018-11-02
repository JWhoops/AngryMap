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

const createBuildings = (bds) => {
  //drop all collections before inserting data----------------------------------
    // dropC(Country)
    // dropC(State)
    // dropC(Institution)
    // dropC(Building)
    // dropC(Floor)
    // dropC(Room)
  //----------------------------------------------------------------------------
    var US = new Country({
      _id: new mongoose.Types.ObjectId(),
      name: "America",
      key: "US"
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
    //createBuildings(buildings) //insert building list into database
    
    buildings.forEach(function(bd){
        insert({
          country:{name:"United States",key:"US"},
          state:{name:"Wisconsin",key:"WISC"},
          institution:{name:"University of Wisconsin-Madison",key:"UWMAD"},
          building:{name:bd.name,key:bd.key,utilities:bd.utilities}
        },3)
        console.log("created a building")
    })
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
const insert = (obj, level)=>{
  Country.findOne({name: obj.country.name},function(err, fCountry){
    console.log(fCountry)
    if(fCountry == null){
      fCountry = create({
      _id: new mongoose.Types.ObjectId(),
      name: obj.country.name,
      key: obj.country.key
    },Country)
    if(level === 0) fCountry.save()
    }
    if(level > 0){
      State.findOne({name: obj.stateName},function(err,fState){
      if(fState == null){
        fState = create({
        _id: new mongoose.Types.ObjectId(),
        name: obj.state.name,
        key: obj.state.key
        },State)
        fCountry.states.push(fState._id)
        fCountry.save()
      }
      if(level === 1) fState.save()
      if(level > 1){
        Institution.findOne({name:obj.institutionName},function(err,fInstitution){
          if(fInstitution==null){
            fInstitution = create({
            _id: new mongoose.Types.ObjectId(),
            name: obj.institution.name,
            key: obj.institution.key
            },Institution)
            fState.institutions.push(fInstitution._id)
            fState.save()
          }
          if(level === 2) fInstitution.save()
          if(level > 2){
            Building.findOne({name:obj.buildingName},function(err,fBuilding){
              if(fBuilding==null){
                fBuilding = create({
                _id: new mongoose.Types.ObjectId(),
                name: obj.building.name,
                key: obj.building.key,
                utilities: obj.building.utilities
                },Building)
                fInstitution.buildings.push(fBuilding._id)
                fInstitution.save()
              }
              fBuilding.save()
            })
          }
        })
       }
      })
    }
  })
}

const create = (obj,schema)=>{
    var createdObj = new schema(obj)
    return createdObj
}

function test(){
    // dropC(Country)
    // dropC(State)
    // dropC(Institution)
    // dropC(Building)
    // dropC(Floor)
    // dropC(Room)
  

}

module.exports = seedDB