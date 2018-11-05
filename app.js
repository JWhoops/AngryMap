//import packages
const express    = require("express"),
      //require models
      Country    = require("./models/country"),
      State      = require("./models/state"),
      Institution= require("./models/institution"),
      Building   = require("./models/building"),
      Floor      = require("./models/floor"),
      Room       = require("./models/room"),
      mongoose   = require("mongoose"),
      //other funcitons
      bodyParser = require("body-parser"),
      utilityDB  = require("./db/utilityDB")
      
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
  //get key from url and render json
  let key = req.params.location.toString()
  utilityDB.getJSONByKey(key,(current,next)=>{
    current = current[0]
    res.jsonp({country,next})
  })
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
  
})

utilityDB.insertByLevel({country:{name:"China",key:"CN"},
                      state:{name:"FuckingDumbIcon",key:"FDIC"},
                      institution:{name:"Fucking of Dumb",key:"FODDD"},
                      building:{name:"fg of dumb icone asdjoge"}
                   },3)


app.listen("8080",process.env.IP,()=>{
  console.log("start running the server")
})
