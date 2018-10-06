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
mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true });

// seed the databse with fake data
// seedDB()

//location route
app.get("/:location",(req,res)=>{
  //get the length of location
  var loca = req.params.location.toString().length
  switch(loca){
    case 2: //country
      res.send("country")
      break
    case 6: //state
      res.send("state")
      break
    case 11: //institution
      res.send("institution")
      break
    case 16: //building
      res.send("building")
      break
    case 20: //floor
      res.send("floor")
      break
    case 25: //room
      res.send("room")
      break
    default:
      res.redirect("/") 
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
  Country.create({name:req.body.country},(err,country)=>{
    if(!err){
     State.create({name:req.body.state},(err,state)=>{
       if(!err){
         //associate state with country
          country.states.push(state)
          country.save();
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
                          res.send("successful uploaded")
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