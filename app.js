//import packages
const express    = require("express"),
      //other funcitons
      bodyParser = require("body-parser"),
      DBUtilities  = require("./db/DBUtilities")
      
//app configs
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //parser object from body

//fking dumb icon
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
  res.render("new")
})

//location create route
app.post("/location", (req,res)=>{
  DBUtilities.insertByLevel(req.body,req.body.level,(insertedObj)=>{
    res.jsonp(insertedObj)
  })
})

app.listen(process.env.PORT,process.env.IP,()=>{
  console.log("start running the server")
})