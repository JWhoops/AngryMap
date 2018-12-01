const express      = require("express"),
      bodyParser   = require("body-parser"),
      DBUtilities  = require("./utilities/dbUtils"),
      imgUtilities = require("./utilities/imageUtils"),
      passport     = require("passport"),
      LocalStrategy= require("passport-local"),
      User   	   = require("./models/user")     
      
//routes
const authRoutes = require("./routes/auth")

//app configs
const app = express()

//some secret values
const my_secret = "Desperate for Half-Life 3, Please Gabe!!!!!!"

app.use(require("express-session")({
  secret: my_secret,
  resave: false,
  saveUninitialized: false
}))

//passport config
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //parser object from body

// dumb icon
app.get('/favicon.ico', (req, res) => res.status(204));

//location route
app.get("/get/:location",(req,res)=>{
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

//auth routers
app.use((req, res, next) => {
	res.locals.currentUser = req.user
	next()
	})

app.use(authRoutes)

//app.listen(process.env.PORT,process.env.IP,()=>{
 
app.listen(8080,()=>{
  console.log("start running the server")
})
