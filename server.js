//server.js

//BASE SETUP
//==============================================================

//Call the packages we need
var express = require('express');   //call express
var app = express();                //define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/expressapp'); // connect to our database

//configure app to ue bodyParser()
//Thi will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Bear = require('./app/models/bear'); // pull Bear into server.js
var User = require('./app/models/user'); // pull User into server.js

var port = process.env.PORT || 8000;    //set the port

// ROUTES FOR OUR API
// ========================================================================

var router = express.Router();          //get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next){
    //do logging
    console.log('Something is happening');
    next(); // make sure we go to the next routes and dont stop here.
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res){
    res.json({ message: 'huzzar! welcome to our api!'});
});

//more routes for our API will happen here

// on routes that end in /bears
// --------------------------------------------------------------------------
router.route('/bears')

    // create a bear (accessed at POST http://localhost:8000/api/bears)
    .post(function(req, res){

        var bear = new Bear(); // create a new instance of the Bear model
        bear.name = req.body.name; // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err){
            if (err)
                res.send(err);

            res.json({message: 'Bear created!'});
        });

    })

    // get all the bears (accessed at GET http://localhost:8000/api/bears)
    .get(function(req, res){
        Bear.find(function(err, bears){
            if (err)
                res.send(err);
        
            res.json(bears);
        });
    });

router.route('/bears/:bear_id')

    // get a single bear
    .get(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    // update a Bears info
    .put(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if (err)
                res.send(err);

            bear.name = req.body.name; //updates the bears info

            //save the bear

            bear.save(function(err){
                if (err)
                    res.send(err)

                res.json({message: 'Bear updated!'});
            });
        });
    })

    // delete a bear
    .delete(function(req, res){
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear){
            if (err)
                res.send(err);

            res.json({message: 'Successfully deleted'})
        });
    });

    router.route('/auth/login')

    //create new user
    .post(function(req, res){

        var user = new User(); // Create an instance of User
        user.name = req.body.name; //adds user name
        user.password = req.body.password;

        user.save(function(err){
            if (err)
                res.send(err);

            res.json({message: 'User created'})
        });
    })


    .get(function(req, res){
        User.find(function(err, users){
            if (err)
                res.send(err);
        
            res.json(users);
        });
    })

    //get user by id
    .get(function(req, res){
        User.findById(req.params.user_id, function(err, user){
            if (err)
                res.send(err)

            res.json(user)
        });
    })

    // update user
    .put(function(req, res){
        User.findById(req.params.user_id, function(err, user){
            if (err)
                res.send(err)

            res.json(user)
        });
    })

    //delete a user
    .delete(function(req, res){
        User.remove({
            _id: req.params.id
        }, function(err, user){
            if (err)
                res.send(err)

            res.json({message: 'User delete'})
        });
    });


// REGISTER OUR ROUTES -------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE server
// ================================================================================
app.listen(port);
console.log('Magic happens on port ' + port);