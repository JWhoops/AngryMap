//container for middlewares
var middlewareObj = {};

//funciton check if login
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

//check if any user in session
middlewareObj.notLoggedIn = function(req, res, next){
    if(!req.user){
	return next();
    }
    res.redirect("/")
}

module.exports = middlewareObj;
