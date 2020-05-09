// Required for Express.
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Required for MongoDB.
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Required for Moment.
var moment = require('moment');
moment().format();

// Required for Socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Schemas for database.
var Powerlifter = require('./models/Powerlifter');;

// Connect to database, load environment variables.
var dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
console.log('\nDatabase connected: ', process.env.MONGODB, '\n');

// Required for Handlebars.
var handlebars = require('handlebars');
var exphbs = require('express-handlebars');
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

// Middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ 
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

// Utility functions.
var functions = require('./utilities/functions');
var determine_gender = functions.determine_gender;
var determine_gender_by_weight_class = functions.determine_gender_by_weight_class;
var determine_weight_class = functions.determine_weight_class;
var is_valid_weight_class = functions.is_valid_weight_class;

// Local port.
var PORT = 3000;

io.on('connection', function(socket){
    /**
     * Displays chat message.
     */
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });

app.get('/',function(req,res){
    /**
     * Home screen.
     */
    Powerlifter.find({}, function(err, powerlifters){
        if (err) throw err;

        var names = []
        for(powerlifter of powerlifters) {
            const name = powerlifter.firstname + " " + powerlifter.lastname
            names.push(name)
        }
        res.render('home',{
            data: powerlifters,
            names: names
        });
    });
});

app.get('/addPowerlifter', function(req, res) {
    /**
     * Create new Powerlifter form.
     */
    res.render('create');
});

app.post('/addPowerlifter', function(req, res) {
    /**
     * POST Request used to add new Powerlifter via `/addPowerlifter`.
     */
    if(!req.body) return res.send("No Data Received!");

    const body = req.body
    
    const squat = parseInt(body.squat)
    const bench = parseInt(body.bench)
    const deadlift = parseInt(body.deadlift)
    const total = squat + bench + deadlift
    const gender = determine_gender(body.gender)
    const weight_class = determine_weight_class(body.weight, gender)

    var powerlifter = new Powerlifter({
        firstname: body.firstname,
        lastname: body.lastname,
        weightclass: {
            weight: weight_class[0],
            plus: weight_class[1],
            gender: (gender ? 'Male' : 'Female')
        },
        squat: squat,
        bench: bench,
        deadlift: deadlift,
        total: total
    });

    powerlifter.save(function(err) {
        if (err) throw err;
        return res.redirect("/");
    }); 
});

app.get('/heaviest_squats', function(req,res){
    /**
     * Display the Powerlifters who have the 3 heaviest squats.
     */

    Powerlifter.find({}, function(err, powerlifters){
        for(powerlifter of powerlifters) {
            powerlifter.display_info = 'squat'
        }
        var sorted = powerlifters.sort((a, b) => (a.squat < b.squat) ? 1 : -1)
        res.render('filter',{
            header: 'Heaviest Squats',
            data: sorted.slice(0,3),
        });
    });
});

app.get('/heaviest_benches', function(req,res){
    /**
     * Display the Powerlifters who have the 3 heaviest benches.
     */

    Powerlifter.find({}, function(err, powerlifters){
        for(powerlifter of powerlifters) {
            powerlifter.display_info = 'bench'
        }
        var sorted = powerlifters.sort((a, b) => (a.bench < b.bench) ? 1 : -1)
        res.render('filter',{
            header: 'Heaviest Benches',
            data: sorted.slice(0,3),
        });
    });
});

app.get('/heaviest_deadlifts', function(req,res){
    /**
     * Display the Powerlifters who have the 3 heaviest deadlifts.
     */

    Powerlifter.find({}, function(err, powerlifters){
        for(powerlifter of powerlifters) {
            powerlifter.display_info = 'deadlift'
        }
        var sorted = powerlifters.sort((a, b) => (a.deadlift < b.deadlift) ? 1 : -1)
        res.render('filter',{
            header: 'Heaviest Deadlifts',
            data: sorted.slice(0,3),
        });
    });
});

app.get('/heaviest_totals', function(req,res){
    /**
     * Display the Powerlifters who have the 3 heaviest totals.
     */

    Powerlifter.find({}, function(err, powerlifters){
        for(powerlifter of powerlifters) {
            powerlifter.display_info = 'total'
        }
        var sorted = powerlifters.sort((a, b) => (a.total < b.total) ? 1 : -1)
        res.render('filter',{
            header: 'Heaviest Totals',
            data: sorted.slice(0,3),
        });
    });
});

app.get('/workouts', function(req,res){
    /**
     * Displays the workouts of all of the Powerlifters.
     * Only displays Powerlifters that have at least one workout.
     */

    Powerlifter.find({}, function(err, powerlifters){
        var filtered = []
        for(powerlifter of powerlifters) {
            if(powerlifter.workouts.length > 0) {
                filtered.push(powerlifter)
            }
        }
        const sorted = filtered.sort((a, b) => (a.lastname < b.lastname) ? 1 : -1)
        res.render('workouts',{
            data: sorted,
        });
    });
})

app.get('/about', function(req,res){
    /**
     * Display About page.
     */
    res.render('about',{});
});

app.get('/chat', function(req,res){
    /**
     * Display Chat page.
     */
    res.render('chat',{});
});

app.get('/api/getPowerlifters', function(req,res){
    /**
     * GET Endpoint for API - Gets all Powerlifters.
     */

    Powerlifter.find({}, function(err, powerlifters){
        if (err) throw err;
        if (!powerlifters || powerlifters.length == 0) return res.send('No powerlifters exist.');
        res.send(powerlifters);
    });
});

app.get('/api/weight_class/:weight_class', function(req,res){
    /**
     * GET Endpoint for API - Gets all Powerlifters in specified weightclass.
     * @param weight_class (Include kg / kg+ at end)
     */

    const weight_class = (req.params.weight_class).split('kg')
    const weight = parseInt(weight_class[0])
    const plus = weight_class[1] == '' ? false : true

    if(!is_valid_weight_class(weight)) {
      return res.send('Invalid weight class.')
    }

    const gender = determine_gender_by_weight_class(weight) ? 'Male' : 'Female'

    Powerlifter.find({
        'weightclass.weight': weight,
        'weightclass.plus': plus,
        'weightclass.gender': gender
    }, function(err, powerlifters){
        if (err) throw err;
        if (!powerlifters || powerlifters.length == 0) return res.send('No powerlifters in that weight class.');
        res.send(powerlifters);
    });
});

app.get('/api/name/:firstname/:lastname', function(req,res){
    /**
     * GET Endpoint for API - Gets Powerlifter with specified name. (Case sensitive)
     * @param firstname
     * @param lastname
     */
    const firstname = req.params.firstname
    const lastname = req.params.lastname

    Powerlifter.findOne({
        firstname: firstname,
        lastname: lastname
    }, function(err, powerlifter){
        if (err) throw err;
        if (!powerlifter) return res.send('No powerlifter with that name.');
        res.send(powerlifter);
    });
});

// Returns name and the specified lift.
app.get('/api/:lift/minimum/:minimum', function(req,res){
    /**
     * GET Endpoint for API - Gets all Powerlifters with the specified lift
     * greater than minimum.
     * @param lift (squat, bench, deadlift)
     * @param minimum
     */
    
    const lift = req.params.lift
    const minimum = parseInt(req.params.minimum)

    Powerlifter.find({
        [lift]: { $gte: minimum }
    }, function(err, powerlifters){
        if (err) throw err;
        if (!powerlifters || powerlifters.length == 0) return res.send('No powerlifters meet that criteria.');
        res.send(powerlifters);
    });
});

app.get('/api/minimum_total/:minimum', function(req,res){
    /**
     * GET Endpoint for API - Gets all Powerlifters with a combined squat, bench,
     * deadlift total greater than minimum.
     * @param minimum 
     */

    const minimum = parseInt(req.params.minimum);

    Powerlifter.find({
        total: { $gte: minimum }
    }, function(err, powerlifters){
        if (err) throw err;
        if (!powerlifters || powerlifters.length == 0) return res.send('No powerlifters meet that criteria.');
        res.send(powerlifters);
    });
});

app.post('/api/addPowerlifter', function(req,res){
    /**
     * POST Endpoint for API - Adds a new Powerlifter.
     * All names are unique.
     * @param firstname
     * @param lastname
     * @param weight (Number only in kg, do not include "kg" at end)
     * @param gender (Male or Female)
     * @param squat (Optional - in lb)
     * @param bench (Optional - in lb)
     * @param deadlift (Optional - in lb)
     */

    if(!req.body) return res.send('No Data Received!');
    const body = req.body
    const gender = determine_gender(body.gender)
    const weight_class = determine_weight_class(body.weight, gender)

    Powerlifter.findOne({
        firstname: body.firstname,
        lastname: body.lastname
        }, 
    function(err, powerlifter){
        if (err) throw err;
        if (powerlifter) return res.send('Powerlifter already exists with that name.');
    });

    var powerlifter = new Powerlifter({
        firstname: body.firstname,
        lastname: body.lastname,
        weightclass: {
            weight: weight_class[0],
            plus: weight_class[1],
            gender: (gender ? 'Male' : 'Female')
        }
    });

    // Checks optional fields
    typeof(body.squat) !== 'undefined' ? powerlifter.squat = body.squat : powerlifter.squat = 0
    typeof(body.bench) !== 'undefined' ? powerlifter.bench = body.bench : powerlifter.bench = 0
    typeof(body.deadlift) !== 'undefined' ? powerlifter.deadlift = body.deadlift : powerlifter.deadlift = 0
    powerlifter.total = powerlifter.squat + powerlifter.bench + powerlifter.deadlift
    
    powerlifter.save(function(err) {
        if (err) throw err;
        return res.send('Succesfully inserted powerlifter.');
    }); 
});

app.post('/api/addWorkout', function(req,res){
    /**
     * POST Endpoint for API - Adds a new workout for Powerlifter.
     * @param firstname
     * @param lastname
     * @param topset_RPE
     * @param weight_squatted (Optional)
     * @param weight_benched (Optional)
     * @param weight_deadlifted (Optional)
     */

    if(!req.body) return res.send('No Data Received!');
    const body = req.body

    Powerlifter.findOne({
        firstname: body.firstname,
        lastname: body.lastname
        }, 
    function(err, powerlifter){
        if (err) throw err;
        if (!powerlifter) return res.send('No powerlifter found with that name.');

        var workout = {
            date: moment().format('MMMM Do YYYY'),
            topset_RPE: parseInt(body.topset_RPE)
        };
        
        // Update fields
        if(typeof(body.weight_squatted) !== 'undefined') {
            const squat = parseInt(body.weight_squatted)
            workout.weight_squatted = squat

            if(squat > powerlifter.squat) {
                powerlifter.squat = squat
            }
        }
        if(typeof(body.weight_benched) !== 'undefined') {
            const bench = parseInt(body.weight_benched)
            workout.weight_benched = bench

            if(bench > powerlifter.bench) {
                powerlifter.bench = bench
            }
        }
        if(typeof(body.weight_deadlifted) !== 'undefined') {
            const deadlift = parseInt(body.weight_deadlifted)
            workout.weight_deadlifted = deadlift

            if(deadlift > powerlifter.deadlift) {
                powerlifter.deadlift = deadlift
            }
        }

        const total = powerlifter.squat + powerlifter.bench + powerlifter.deadlift
        if(powerlifter.total < total) {
            powerlifter.total = total
        }

        powerlifter.workouts.push(workout);

        powerlifter.save(function(err) {
            if (err) throw err;
            res.send('Sucessfully added workout.');
        });
    });
});

app.post('/api/removeWorkouts', function(req,res){
    /**
     * POST Endpoint for API - Removes all workouts of a Powerlifter.
     * @param firstname
     * @param lastname
     */

    if(!req.body) return res.send('No Data Received!');
    const body = req.body

    Powerlifter.findOne({
        firstname: body.firstname,
        lastname: body.lastname
        }, 
    function(err, powerlifter){
        if (err) throw err;
        if (!powerlifter) return res.send('No powerlifter found with that name.');

        powerlifter.workouts = []

        powerlifter.save(function(err) {
            if (err) throw err;
            res.send('Sucessfully removed workouts.');
        });
    });
});

app.delete('/api/deletePowerlifter', function(req,res){
    /**
     * DELETE Endpoint for API - Deletes existing Powerlifter.
     * @param firstname
     * @param lastname
     */

    if(!req.body) return res.send('No Data Received!');
    const body = req.body

    Powerlifter.findOne({
        firstname: body.firstname,
        lastname: body.lastname
        }, 
        function(err, powerlifter){
            if (err) throw err;
            if (!powerlifter) return res.send('No powerlifter found with that name.');
    });

    Powerlifter.deleteOne({
        firstname: body.firstname,
        lastname: body.lastname
    }, function(err) {
        if (err) throw err;
        res.send('Powerlifter deleted!');
    });
});

app.delete('/api/deleteAllPowerlifters', function(req,res){
    /**
     * DELETE Endpoint for API - Deletes all Powerlifters.
     */
    Powerlifter.deleteMany({}, function(err){
        if (err) throw err;
        res.send('Deleted all powerlifters.')
    });
});

http.listen(process.env.PORT || PORT, function() {
    console.log('\nListening on port:', PORT, '\n');
});
