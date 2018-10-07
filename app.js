//import packages
const express     = require("express"),
      //require models
      Country     = require("./models/country"),
      State       = require("./models/state"),
      Institution = require("./models/institution"),
      Building    = require("./models/building"),
      Floor       = require("./models/floor"),
      Room        = require("./models/room"),
      mongoose    = require("mongoose"),
      //other funcitons
      bodyParser  = require("body-parser")
      // seedDB   = require("./seeds")
      
//app configs~~~~~~~~~~~~~~~~~~~~~~~
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //parser object from body

// DB config
mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true })

// seed the databse with fake data
// seedDB()


function getFromDB(code, scope){
  var obj
  switch(scope){
    case 'country':
      //return a country
      Country.find({key:code.substring(0,2)},(err,country)=>{
        if(!err){
          obj.country = country
          obj.states = country.states
        }
      })
      break
    case 'state':
      //return a state
      break
    case 'institution':
      //some quantum shit here
      break
    case 'building':
      //some quantum shit here
      break
    case 'floor':
      //some quantum shit here
      break
    case 'room':
      //some quantum shit here
      break
    default:
      return {error:'undefined scope'}
  }     
  return obj
}


//location route
app.get("/:location",(req,res)=>{
  //get the geoHash code
  var code = req.params.location.toString()
  //get the length of location
  var loca = code.length
  var geoObj = {geoHash:code}
  if(loca<2){
    //invalid geoHash code, return 500
    res.json(500, { error: "invalid geoHash code." }) 
  }
  /* Annotation:
   * If there is no key correspons to the key from the geoHash code
   * throw error and redirect to an error page or send an error info.
   * mark indicates the information needed to append to the geoObj, or 
   * append the information right in the if statement...
   */
  if(loca>=2){
    //TODO:get country from db and push it to the geoObj
    geoObj.country = getFromDB(code, 'country')
    geoObj.mark = 'state'
  } 
  if(loca>=6){
    //TODO:get state from db and push it to the geoObj
    geoObj.state = obj.states[code.substring(2,6)];
    geoObj.mark = 'institution'
  }
  if(loca>=11){
    //TODO:get institution from db and push it to the geoObj
    geoObj.institution = getFromDB(code, 'institution')
    geoObj.mark = 'building'
  }
  if(loca>=16){
    //TODO:get building from db and push it to the geoObj
    geoObj.building = getFromDB(code, 'building')
    geoObj.mark = 'floor'
  }
  if(loca>=20){
    //TODO:get floor from db and push it to the geoObj
    geoObj.floor = getFromDB(code, 'floor')
    geoObj.mark = 'room'
  }
  if(loca>=25){
    //TODO:get room from db and push it to the geoObj
    geoObj.room = getFromDB(code, 'room')
  }
  //send the object(Express exclusive)
  res.json(geoObj)
})

//root route
app.get("/",(req,res)=>{
  res.render("index")
})

//new page route
app.get("/location/new", (req,res)=>{
  res.render("new")
})

//location create route
app.post("/location", (req,res)=>{
  Country.create({name:req.body.country,key:req.body.country_key},(err,country)=>{
    if(!err){
     State.create({name:req.body.state,key:req.body.state_key},(err,state)=>{
       if(!err){
         //associate state with country
          country.states.push(state)
          country.save()
          Institution.create({name:req.body.institution,key:req.body.institution_key},(err,institution)=>{
            if(!err){
              //associate institution with state
              state.institutions.push(institution)
              state.save()
              Building.create({name:req.body.building,key:req.body.building_key},(err,building)=>{
                if(!err){
                  //associate building with institution
                  institution.buildings.push(building)
                  institution.save()
                  Floor.create({name:req.body.floor,key:req.body.floor_key},(err,floor)=>{
                    if(!err){
                      //associate floor with building
                      building.floors.push(floor)
                      building.save()
                      Room.create({name:req.body.room,key:req.body.room_key},(err,room)=>{
                        if(!err){
                          //associate room with building
                          floor.rooms.push(room)
                          floor.save()
                          res.send("uploaded successfully")
                        }
                      })
                    }
                  })
                }
              })
            }
          })  
       }
     }) 
    }
  })
})

app.listen(process.env.PORT,process.env.IP,()=>{
  console.log("start running the server")
})
