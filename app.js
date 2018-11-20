const express      = require("express"),
      bodyParser   = require("body-parser"),
      DBUtilities  = require("./utilities/dbUtils"),
      imgUtilities = require("./utilities/imageUtils")
      
//app configs
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //parser object from body

// dumb icon
app.get('/favicon.ico', (req, res) => res.status(204));

//location route
app.get("/:location",(req,res)=>{
  //get key from url and render json
  DBUtilities.getJSONByKey(req.params.location.toString(),(current,next)=>{
      res.jsonp({current,next})
  })
})

//root route
app.get("/",(req,res)=>{
  res.render("index")
})

//new page route
app.get("/location/new", (req,res)=>{
  DBUtilities.getJSONByKey("USWISCUWMAD",(current,next)=>{
      res.render('new',{bds:next})
  })
})

//insert utility
app.post("/utility",imgUtilities.uploadByType('image'),(req,res)=>{
  imgUtilities.uploadImage(req.file,(imgURL)=>{
    let utility = req.body.utility
    utility.image = imgURL
    DBUtilities.insertUtility(req.body.key,utility,(bd)=>{
      res.redirect("/")
    })
  })
})

//location create route
app.post("/location",imgUtilities.uploadByType('image'),(req,res)=>{
  imgUtilities.uploadImage(req.file,(imgURL)=>{
    req.body.building.image = imgURL
    DBUtilities.insertByLevel(req.body,req.body.level,(insertedObj)=>{
      res.redirect("/")
    })
  }) 
})

app.listen(process.env.PORT,process.env.IP,()=>{
  console.log("start running the server")
})