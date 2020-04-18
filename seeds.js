const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment   = require("./models/comment");
 
var campgroundSeeds = [
    {
        name: "Cloud's Rest", 
        image: "https://images.unsplash.com/photo-1533873984035-25970ab07461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1053&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {
            username: "CampgroundsUnited"
        },
    },
    {
        name: "Desert Mesa", 
        image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {
            username: "CampgroundsUnited"
        },
    },
    {
        name: "Canyon Floor", 
        image: "https://images.unsplash.com/photo-1517440155813-114ea44e9075?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {
            username: "CampgroundsUnited"
        },
    }
];

async function seedDB(){
    try {
        // remove comments & campgrounds
        await Comment.deleteMany({});
        await Campground.deleteMany({});

        // loop through seeds and create new campgrounds
        for(const seed of campgroundSeeds){
            // create campground & comment(s)
            let campground = await Campground.create(seed);
            let comment = await Comment.create(
                {
                    text: 'This place is great, but I wish there was internet',
                    author: {
                        username: "Homer"
                    }
                }
            );

            // push comment(s) to new campground
            campground.comments.push(comment);

            // save campground
            campground.save();
        };
    } catch(err) {
        console.log(err);   
    };
};
 
module.exports = seedDB;