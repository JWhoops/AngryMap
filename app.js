//import packages
const express    = require("express"),
      //other funcitons
      bodyParser = require("body-parser"),
      DBUtilities  = require("./db/DBUtilities")
      
//app configs
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //parser object from body

//cloudinary setup
var cloudinary = require('cloudinary');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

cloudinary.config({ 
  cloud_name: 'madmap', 
  api_key: "878488145471865", 
  api_secret: "6rjAFhuPOISffrw5BNCJUxr6Zug"
});

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

app.post("/utility/new",upload.single('image'),(req,res)=>{
  if(req.file){
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the object under image property
        let utility = req.body.utility
            utility.image = result.secure_url
        DBUtilities.insertUtility(req.body.key,utility,(bd)=>{
          res.redirect("/")
        })
    })
  }else{
      let utility = req.body.utility
      utility.image = "http://college.koreadaily.com/wp-content/uploads/2018/03/BascHill_autumn16_5788-1600x500.jpg"
      DBUtilities.insertUtility(req.body.key,utility,(bd)=>{
          res.redirect("/")
      })
  }
})

//location create route
app.post("/location",upload.single('image'),(req,res)=>{
  //check image file exist
  if(req.file){
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the object under image property
        req.body.building.image = result.secure_url;
        DBUtilities.insertByLevel(req.body,req.body.level,(insertedObj)=>{
          res.jsonp(insertedObj)
      })
    })
  }else{
    req.body.building.image = "http://college.koreadaily.com/wp-content/uploads/2018/03/BascHill_autumn16_5788-1600x500.jpg"
    DBUtilities.insertByLevel(req.body,req.body.level,(insertedObj)=>{
      res.jsonp(insertedObj)
    })
  }
})

app.listen(process.env.PORT,process.env.IP,()=>{
  console.log("start running the server")
})