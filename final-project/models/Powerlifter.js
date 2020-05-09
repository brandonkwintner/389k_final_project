var mongoose = require('mongoose'); 
mongoose.Promise = global.Promise

/**
 * Schema for Weightclass.
 * Stored in kg.
 * Plus field is for the heaviest weight class.
 */
var weightclassSchema = new mongoose.Schema({
    weight:{
        type: Number,
        required: true
    },
    plus:{
        type: Boolean,
        required: true
    },
    gender:{
        type: String,
        required: true
    }
});

/**
 * Schema for Workout
 * topset_RPE: "On a scale of 1 - 10, how much effort did you give when you
 *              lifted the heaviest weight for the day?"
 */
var workoutSchema = new mongoose.Schema({
    date:{
        type: String
    },
    weight_squatted:{
        type: Number
    },
    weight_benched:{
        type: Number
    },
    weight_deadlifted:{
        type: Number
    },
    topset_RPE:{
        type: Number,
        min: 1.0,
        max: 10.0,
        required: true
    }
});

/**
 * Schema for Powerlifter.
 * Only first name, last name, and weight class are required.
 */
var powerlifterSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    weightclass:{
        type: weightclassSchema,
        required: true
    },
    squat:{
        type: Number,
        default: 0
    },
    bench:{
        type: Number,
        default: 0
    },
    deadlift:{
        type: Number,
        default: 0
    },
    total:{
        type: Number,
        default: 0
    },
    workouts:{
        type: [workoutSchema]
    }
});

var Powerlifter = mongoose.model('Powerlifter', powerlifterSchema);
module.exports = Powerlifter