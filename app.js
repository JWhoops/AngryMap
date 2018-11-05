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
    let current = current[0]
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

function hash(str, len) {
        if(len<1)
                return null;
        if(len>=str.length)
            return str;
        var ucIndex = [];
        for(var i=0;i<str.length;i++){
                var c = str.charAt(i);
                if(c == c.toUpperCase()&&c!=" ")
                        ucIndex.push(i);
        }
        if(ucIndex.length==0)
                return str.substring(0,len);
        return getChars(str, ucIndex, len);
}

function getChars(str, ucIndex, len){
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
        if(diff<0)
            return result.substring(0,len);
        for(var i=0;i<diff;i++){
                result+=str.charAt(ucIndex[endIndex]+i);
        }
        return result;
}

app.listen("8080",process.env.IP,()=>{
  console.log("start running the server")
})
