const express = require("express"),
      router  = express.Router(),
      passport= require("passport"),
      middleware = require("../middleware"),
      User = require("../models/user");

//index routes
router.get("/",(req,res)=>{
  res.render("index")
})

//Auth routes~~~~~~~~~~i~~~~~~~~~~~~~~~~~~~~~
//reigister routes
router.get("/register", (req,res)=>{
  res.render("../views/users/register");
})

router.post("/register", (req,res)=>{
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password,(err,user)=>{
    if(err){
      console.log(err)
      return res.render("/")
    }
    passport.authenticate("local")(req,res,()=>{
    res.redirect("./")
    })
  })
})

//login
router.get("/login",middleware.notLoggedIn,(req,res)=>{
  res.render("../views/users/login")
})

//login logic
router.post("/login",middleware.notLoggedIn, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
  
});

//logout route
router.get("/logout",middleware.isLoggedIn,(req,res)=>{
  req.logout();
  res.redirect("/")
})

module.exports = router
