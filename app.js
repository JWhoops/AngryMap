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
      bodyParser  = require("body-parser"),
      seedDB      = require("./seeds")
      
      //database test=================
      //seedDB() //seed db with data
      //================================
      
//app configs~~~~~~~~~~~~~~~~~~~~~~~
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //parser object from body

// DB config
mongoose.connect("mongodb://parktower702:parktower702@ds123783.mlab.com:23783/utility_map",{ useNewUrlParser: true })

// seed the databse with fake data
  seedDB()

//location route
app.get("/:location",(req,res)=>{
  //get the geoHash code
  var code = req.params.location.toString()
  //get the length of location
  var loca = code.length
  //how to return json in express? res.json(obj) you are welcome
  switch(loca){
    case 2: //country
      Country.find({"key": code.substring(0,2)},{"key":true, "name":true,"states":true,"_id":false},(err,country)=>{
        if(!err){
          State.find({"_id":country.states},{"key":true, "_id":false, "name":true},(err,foundStates)=>{
            if(!err){
              country.states = undefined
              res.json({country,foundStates})
            } 
          })
        }
      })
      break
    case 6: //state
      //some quantum sheet here
      break
    case 11: //institution
      //some quantum db operations here
      break
    case 16: //building
       Building.findOne({"key":code.substring(11,17)},{"key":true,"utilities":true,"_id":false,"name":true},(err,foundBuilding)=>{
        // let utilities = foundBuilding.utilities
        res.jsonp(foundBuilding)
      })
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
              Building.create({lat:req.body.lat,lng:req.body.lng,name:req.body.building,key:req.body.building_key},(err,building)=>{
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

app.listen("8080",process.env.IP,()=>{
  console.log("start running the server")
})
