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

//location route
app.get("/:location",(req,res)=>{
  //get the geoHash code
  var code = req.params.location.toString()
  //get the length of location
  var loca = code.length
  var geoObj = {geoHash:code}
  if(loca<2){
    //TODO:error page or send an error info
    //res.redirect('/')
  }
  /* Annotation:
   * If there is no key correspons to the key from the geoHash code
   * throw error and redirect to an error page or send an error info.
   */
  if(loca>=2){
    //TODO:get country from db and push it to the geoObj
    geoObj.country = getCountryFromDB(code)
  } 
  if(loca>=6){
    //TODO:get state from db and push it to the geoObj
    geoObj.state = getStateFromDB(code)
  }
  if(loca>=11){
    //TODO:get institution from db and push it to the geoObj
    geoObj.institution = getInstitutionFromDB(code)
  }
  if(loca>=16){
    //TODO:get building from db and push it to the geoObj
    geoObj.building = getBuildingFromDB(code)
  }
  if(loca>=20){
    //TODO:get floor from db and push it to the geoObj
    geoObj.floor = getFloorFromDB(code)
  }
  if(coca>=25){
    //TODO:get room from db and push it to the geoObj
    geoObj.room = getRoomFromDB(code)
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
  Country.create({name:req.body.country},(err,country)=>{
    if(!err){
     State.create({name:req.body.state},(err,state)=>{
       if(!err){
         //associate state with country
          country.states.push(state)
          country.save()
          Institution.create({name:req.body.institution},(err,institution)=>{
            if(!err){
              //associate institution with state
              state.institutions.push(institution)
              state.save()
              Building.create({name:req.body.building},(err,building)=>{
                if(!err){
                  //associate building with institution
                  institution.buildings.push(building)
                  institution.save()
                  Floor.create({name:req.body.floor},(err,floor)=>{
                    if(!err){
                      //associate floor with building
                      building.floors.push(floor)
                      building.save()
                      Room.create({name:req.body.room},(err,room)=>{
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
