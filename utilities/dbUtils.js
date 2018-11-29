const utilityDB = (() =>{
  //quire schema
  let mongoose    = require("mongoose"),
      Country     = require("../models/country"),
      State       = require("../models/state"),
      Institution = require("../models/institution"),
      Building    = require("../models/building"),
      Floor       = require("../models/floor"),
      Room        = require("../models/room")
  
  // connect DB
  mongoose.connect("mongodb://aa5330593:aa5330593@ds249583.mlab.com:49583/utility_map",{ useNewUrlParser: true })
  
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
    schema.find({key:queryKey},{_id:false,__v:false},(err,result)=>{
          if(err) console.log(er)
          callback(result)
        });
  }
  //read database using regex
  const readDBbyRegexKey = (regexKey,schema,callback)=>{
    schema.find({key: new RegExp(regexKey,"i")},{_id:false,__v:false},
      (err,result)=>{
            if(err) console.log(err)
            callback(result)
        });
  }
  //get current and next level
  const getCurrentAndNextLevel = (queryKey,currentSchema,nextSchema,callback)=>{
    readDBbyKey(queryKey,currentSchema,(fCurrent)=>{
          readDBbyRegexKey('^'+ queryKey,nextSchema,(fNext)=>{
            /*too lazy to create find by key using findOne
            use [0] to substitute*/
            fCurrent = fCurrent[0]
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
        break
      case 16: //building
        getCurrentAndNextLevel(queryKey,Building,Floor,callback)
        break
      default:
        //500 json
        break
    }
  }

  //insert a record using level
  const insertByLevel = (obj,level,callback) => {
    for (let i = 0; i <= level; i++) {
     switch(i){
      case 0:
        insertOne(obj.country,Country)
        break
      case 1:
        obj.state.key = obj.country.key.concat(obj.state.key)
        insertOne(obj.state,State)
        break
      case 2:
        obj.institution.key = obj.state.key.concat(obj.institution.key)
        insertOne(obj.institution,Institution)
        break
      case 3:
        //hash building key
        obj.building.key = (obj.institution.key.
                            concat(hashBdKey(obj.building.name,5))).toUpperCase()
        insertOne(obj.building,Building)
        break
      default:
        console.log("err insertByLevel")
        break
     }
    }
    callback(obj)
  }

// Read Asynchrously
 const getJsonObj = (path) => { 
  var fs = require("fs");
  console.log("\n *START READING JSON* \n");
  var content = JSON.parse(fs.readFileSync(path));
  return content;
 }

  const hashBdKey = (str, len) => {
        if(len<1||str==null)
                return null;
	str = str.trim();
        if(len>=str.length)
            return str.toUpperCase();
        var ucIndex = [];
        for(var i=0;i<str.length;i++){
                var c = str.charAt(i);
                if(c == c.toUpperCase()&&c!=" ")
                        ucIndex.push(i);
        }
        if(ucIndex.length==0)
                return replaceSpaceWithUnderscore(str.substring(0,len).toUpperCase());
        return getChars(str, ucIndex, len);
}

  const getChars = (str, ucIndex, len) => {
        var unitCount = len/(ucIndex.length);
        var result = "";
        var endIndex = 0;
        for(var i=0;i<ucIndex.length;i++){
                for(var j=0;j<unitCount;j++){
                        result+=str.charAt(ucIndex[i]+j);
                }
                endIndex = i;
        }
        var diff = len-result.length;
        result = result.toUpperCase();
        if(diff<0)
            return result.substring(0,len);
        for(var i=0;i<diff;i++){
                result+=str.charAt(ucIndex[endIndex]+i);
        }
        return result;
}

  const replaceSpaceWithUnderscore = (str) => {
  	var result = "";
  	for(var i=0;i<str.length;i++){
  		var c = str.charAt(i);
  		result+=(c==' '?"_":c);
  	}
  	return result;
  }
//insert utility for buildings
  const insertUtility = (key,utility,callback)=>{
    Building.findOne({"key":key},(err,result)=>{        
      result.utilities.push(utility)
      result.save((err)=>{
        if(err) console.log(err)
        callback(result)
      })
    });
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
                            key:bdObj.key,
                            image:bdObj.image})
      bd.save()
    })
  }

  const populateMadison = ()=>{
    //read buildings and microwaves json files
    let buildings =  getJsonObj('./test_jsons/buildings.json').buildings
    let microwaves = getJsonObj('./test_jsons/Microwaves.json').microwaves
    let printers = getJsonObj('./test_jsons/Printers.json').printers
    buildings.forEach((building)=>{
      building.image = "http://cdn.redalertpolitics.com/files/2017/10/UW-Madison-lincoln.jpg"
      let utility = []
      microwaves.forEach((microwave)=>{
        if(building.key === microwave.key){
          //push utilites into building's utilities array using same key
          microwave.image = "http://cdn.wrn.com/wp-content/uploads/2016/01/Motion-W.jpg"
          utility.push(microwave)
        }
      })
      printers.forEach((printer)=>{
        if(building.key === printer.key){
          //push utilites into building's utilities array using same key
          printer.image = "http://cdn.wrn.com/wp-content/uploads/2016/01/Motion-W.jpg"
          utility.push(printer)
        }
      })

      building.utilities = utility //assign utility to buildings
      building.key = "USWISCUWMAD"+building.key
      })
      populateBuildings({name:"United States",key:"US"},
                        {name:"Wisconsin",key:"USWISC"},
                        {name:"University of Wisconsin-Madison",key:"USWISCUWMAD"},
                        buildings) //insert building list into database
    }

    // populateMadison()

  return{getJSONByKey,insertByLevel,insertUtility}
})()

module.exports = utilityDB
