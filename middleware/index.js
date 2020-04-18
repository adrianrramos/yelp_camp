var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash("error", "Something went wrong.");
               res.redirect("back");
            }  else {
                // does user own the campground?
                if(!foundCampground) {
                   req.flash("error", "Item not found.");
                   return res.redirect("back");                  
                }
                if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
            req.flash("error", "Uh oh, something went wrong");
               res.redirect("back");
            }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You do not have permission to do that.");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;