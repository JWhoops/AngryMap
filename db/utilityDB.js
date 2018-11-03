const utilityDB = (() =>{
  //quire schema
  let mongoose    = require("mongoose"),
      Country     = require("../models/country"),
      State       = require("../models/state"),
      Institution = require("../models/institution"),
      Building    = require("../models/building"),
      Floor       = require("../models/floor"),
      Room        = require("../models/room")

  //create one record if not exists
  const createIfNotExists = (obj,schema)=>{
    schema.findOne({key:obj.key},(err,fObj)=>{
    if(err) console.log(err)
    if(!fObj){
        fObj = new schema(obj)
        fObj.save()
      }
  })
  }
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
  const readDBbyKey = (queryKey,schema,callback)=>{
    schema.find({key:queryKey},(err,result)=>{
          callback(result)
        });
  }
  //read database using regex
  const readDBbyRegexKey = (regexKey,schema,callback)=>{
    schema.find({key: new RegExp(regexKey,"i")},(err,result)=>{
          callback(result)
        });
  }
  //get current and next level
  const getCurrentAndNextLevel = (queryKey,currentSchema,nextSchema,callback)=>{
    readDBbyKey(queryKey,currentSchema,(fCurrent)=>{
          readDBbyRegexKey('^'+ queryKey,nextSchema,(fNext)=>{
            callback(fCurrent,fNext)
          })
        })
  }

  /*get data of current and next level by length
  of key and then return both levels using callback*/
  const getJSONByKey = (queryKey,callback)=>{
    switch(queryKey.length){
      case 2: //country
        getCurrentAndNextLevel(queryKey,Country,State,callback)
        break
      case 6: //state
        getCurrentAndNextLevel(queryKey,State,Institution,callback)
        break
      case 11: //institution
        getCurrentAndNextLevel(queryKey,Institution,Building,callback)
      case 16: //building
        getCurrentAndNextLevel(queryKey,Building,Floor,callback)
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
    bdObjs.forEach((bdObj)=>{
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
  return{getJSONByKey}
})()

module.exports = utilityDB