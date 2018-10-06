//import packages
const express = require("express")
//app configs
const app = express()

//location route
app.get("/:location",(req,res)=>{
  var s = req.params.location.toString().length 
  switch(s){
    case 2:
      res.send("country")
      break
    case 4:
      res.send("state")
  }
})

//root route
app.get("/",(req,res)=>{
  res.send("Hey I am a crazy bucky")
})

app.listen(process.env.PORT,process.env.IP,()=>{
  console.log("start running the server")
})