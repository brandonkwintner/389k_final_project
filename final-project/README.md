
# Powerlifting Central

---

Name: Brandon Kwintner

Date: May 3, 2020

Project Topic: Powerlifting Personal Records 

URL: http://localhost:3000 ### UPDATE WITH DEPLOYABLE LINK ! ###

# New NPM packages used: 
- Moment.js
- Bootstrap

---

### 1. Data Format and Storage

- Data is stored with a MongoDB cluster.
- 3 Schemas used to store information, described below.

powerlifterSchema: 
```javascript
{
    firstname: String,
    lastname: String,
    weight_class: weightclassSchema,
    squat: Number,
    bench: Number,
    deadlift: Number,
    total: Number,
    workouts: [workoutSchema]
}
```

weightclassSchema:
```javascript
{
    weight: Number,
    plus: Boolean,
    gender: String
}
```

workoutSchema:
```javascript
{
    date: String,
    weight_squatted: Number,
    weight_benched: Number,
    weight_deadlifted: Number,
    topset_RPE: Number
}
```

### 2. Add New Data

HTML form route: `/addPowerlifter`

POST endpoint route: `/api/addPowerlifter`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/addPowerlifter',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       firstname: Brandon,
       lastname: Kwintner
       weight_class: 81,
       gender: Male,
       squat: 335,
       bench: 245,
       deadlift: 405
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

1. `/api/getPowerlifters` - All Powerlifters
2. `api/weight_class/:weight_class` - Filter by weight class
3. `api/name/:firstname/:lastname` - Filter by name
4. `api/:lift/minimum/:minimum` - Filter by minimum amount for a specific lift
5. `api/minimum_total/:minimum` - Filter by minimum amount for combined total

### 4. Post Data

1. `/api/addPowerlifter` - Add new Powerlifter
2. `/api/addWorkout` - Add new workout for Powerlifter
3. `/api/removeWorkouts` - Removes all workouts for Powerlifter

### 5. Delete Data

1. `/api/deletePowerlifter` - Deletes Powerlifter
2. `/api/deleteAllPowerlifters` - Deletes all Powerlifters

### 6. Search Data

Search Field: `name`

### 7. Navigation Pages

Navigation Filters
1. Home Page -> `/`
2. Workouts -> `/workouts`
3. Heaviest Squats -> `/heaviest_squats`
4. Heaviest Benches -> `/heaviest_benches`
5. Heaviest Deadlifts -> `/heaviest_deadlifts`
6. Heaviest Totals -> `/heaviest_totals`
7. About -> `/about`