const express = require('express');
const router =  express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');
var middleware = require("../middleware");

// =================
// COMMENTS ROUTES
// =================

// comments NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
            // redirect to comments form and pass campground properties
            res.render("comments/new", { campground: campground });
        };
    })
});

// comments CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
    // lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else {
                    // add usernam & id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username; // req.user works b/c of middlewre checks for user
                    // save comment w/ username/id
                    comment.save();
                    // connect new comment with campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect user back to cammpground show page
                    req.flash("success", "Comment added!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

// EDIT - route for comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    // we have the campground id further back inside our route url
    // **check app.js => app.use("/campgrounds/:id/comments")
    let campgroundId = req.params.id

    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.send(err);
        } else {
            res.render("comments/edit", { comment: foundComment, campground_id: campgroundId });
        }
    });
});

// UPDATE - update changes to comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    // find and update the correct campground
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedCommnent) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// comment DESTROY route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            req.flash("error", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;