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
      seedDB() //seed db with data
      //================================
      
//app configs~~~~~~~~~~~~~~~~~~~~~~~
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //parser object from body

// DB config
mongoose.connect("mongodb://aa5330593:aa5330593@ds249583.mlab.com:49583/utility_map",{ useNewUrlParser: true })

//fking dumb icon
app.get('/favicon.ico', (req, res) => res.status(204));

//location route
app.get("/:location",(req,res)=>{

  //get the geoHash code
  var code = req.params.location.toString()

  //get the length of location
  var loca = code.length

  //how to return json in express? res.json(obj) you are welcome
  switch(loca){
    case 2: //country
      Country.findOne({"key": code.substring(0,2)},{"key":true, "name":true,"states":true,"_id":false},(err,foundCountry)=>{
        if(!err){
          State.find({"_id":foundCountry.states},{"key":true, "_id":false, "name":true},(err,foundStates)=>{
            if(!err){
              foundCountry.states = undefined
              res.jsonp({foundCountry,foundStates})
            } 
          })
        }
      })
      break
    case 6: //state
      State.findOne({"key": code.substring(2,6)},{"key":true, "name":true,"institutions":true,"_id":false},(err,foundState)=>{
        if(!err){
          Institution.find({"_id":foundState.institutions},{'_id':false,"buildings": false},(err,foundInstitutions)=>{
            if(!err){
              foundState.institutions = undefined
              res.jsonp({foundState,foundInstitutions})
            } 
          })
        }
      })
      break
    case 11: //institution
      //some db operations here
      Institution.findOne({"key": code.substring(6,11)},{"key":true, "name":true,"buildings":true,"_id":false},(err,foundInstitution)=>{
        if(!err){
          Building.find({"_id":foundInstitution.buildings},(err,foundBuildings)=>{
            if(!err){              
              foundInstitution.buildings = undefined
              res.jsonp({foundInstitution,foundBuildings})
            } 
          })
        }
      })
      break
    case 16: //building
       Building.find({"key":code.substring(11,17)},(err,foundBuilding)=>{
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
