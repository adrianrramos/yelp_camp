const express = require('express');
const router =  express.Router();
const Campground = require('../models/campground');
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/campgrounds", 
    (req, res) => {
        Campground.find({}, (err, allCampgrounds) => {
            if(err){
                console.log("SOMETHING WENT WRONG LOADING ALL CAMPGROUNDS", err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds });
            }
        })
    }
);

// CREATE - add new campground to db
router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
        // get data from the form we submit
        const name = req.body.name;
        const image = req.body.image;
        const description = req.body.description;
        const author = {
            id: req.user._id,
            username: req.user.username
        };
        const newCampground = { name:name, image:image, description:description, author:author };
        // Create a new camp ground to save to the database
        Campground.create(
            newCampground,
            (err, newlyCreatedCampground) => {
                if(err) {
                    console.log("SOMETHING WENT WRONG CREATING A CAMPGROUND", err)
                } else {
                    // redirect back to campgrounds page
                    res.redirect("/campgrounds")           
                }
            }
        )
    }
);

// NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn,(req, res) => {
        res.render("campgrounds/new")
    }
);

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec( 
        (err, foundCampground) => {
            if(err){
                console.log(err);
            } else {
                if(!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");                  
                };
                //render show template with that campground
                res.render("campgrounds/show", {campground: foundCampground});
            }
    });
});

// EDIT - campground edit form 
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            res.send(err);
        } else {
            if(!foundCampground) {
                req.flash("error", "Item not found.");
                return res.redirect("back");                  
            }
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    }); 
});

// UPDATE - update changes to campground
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE - destroy any campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err,) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            req.flash("error", "Campground Deleted");
            res.redirect("/campgrounds");
        };
    });
});

module.exports = router;