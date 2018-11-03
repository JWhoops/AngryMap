var mongoose    = require("mongoose"),
    Country     = require("./models/country"),
    State       = require("./models/state"),
    Institution = require("./models/institution"),
    Building    = require("./models/building"),
    Floor       = require("./models/floor"),
    Room        = require("./models/room")

//insert many record using aray
const insertMany = (objArray,schema)=>{
  objArray.forEach((obj)=>{
      createIfNotExists(obj,schema)
    })
}
//insert a new record
const insertOne = (obj,schema)=>{
  createIfNotExists(obj,schema)
}
//delete one record
const deleteOne = (obj,schema)=>{
  schema.deleteOne({name:obj.name},(err)=>{
    console.log(err)
  });
}
//update a record
const updateOne = (obj,updatedObj,schema)=>{
  schema.findOneAndUpdate(obj,updatedObj,(err)=>{console.log(err)}) // executes
}
//read based on key and schema
const readDatas = (queryKey,schema,callback)=>{
  schema.find({key:queryKey},(err,foundCountry)=>{
        callback(foundCountry)
      });
}
//create one record if not exists
var createIfNotExists = (obj,schema)=>{
  schema.findOne({key:obj.key},(err,fObj)=>{
  if(err){
    console.log(err)
  }
  if(!fObj){
      fObj = new schema(obj)
      fObj.save()
    }
})
}
//working on it
const readJSONByKey = (queryKey,callback)=>{
  switch(queryKey.length){
    case 2: //country
      readDatas(queryKey.substring(0,2),Country,callback)
      break
    case 6: //state
      readDatas(queryKey.substring(2,6),State,callback)
      break
    case 11: //institution
      readDatas(queryKey.substring(6,11),Institution,callback)
    case 16: //building
      readDatas(queryKey.substring(1,17),Building,callback)
      break
    case 20: //floor
      //i need to finish my paper by tuesday
      break
    case 25: //room
      //so maybe i should work on that tomorrow
      break
    default:
      //500 json
  }

}
//used to populate buildings
const populateBuildings = (countryObj,stateObj,institutionObj,bdObjs) => {
    insertOne(countryObj,Country)
    insertOne(stateObj,State)
    insertOne(institutionObj,Institution)
 //spceial because of coordinates
    bdObjs.forEach(function(bdObj){
      var bd = new Building({
                            utilities:bdObj.utilities,
                            //coordinates是反过来的
                            lat:bdObj.coordinates[1],
                            lng:bdObj.coordinates[0],
                            name:bdObj.name,
                            key:bdObj.key})
      bd.save()
    })
}

// Read Asynchrously
 const getJsonObj = (path) => { 
  var fs = require("fs");
  console.log("\n *START READING JSON* \n");
  var content = JSON.parse(fs.readFileSync(path));
  return content;
 }

const populateMadison = () => {
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
    // populateBuildings({name:"United States",key:"US"},
    //                   {name:"Wisconsin",key:"WISC"},
    //                   {name:"University of Wisconsin-Madison",key:"UWMAD"},
    //                   buildings) //insert building list into database

  }


module.exports = populateMadison