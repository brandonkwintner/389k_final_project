
# Powerlifting Personal Records

---

Name: Brandon Kwintner

Date: March 21, 2020

Project Topic: Powerlifting Personal Records 

URL: http://localhost:3000

*** When I refer to total, it means the sum of weight from squat, bench, and deadlift combined. ***

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`:     Name       `Type: String`
- `Field 2`:     Weight Class      `Type: String `
- `Field 3`:     Squat      `Type: Number`
- `Field 4`:     Bench      `Type: Number`
- `Field 5`:     Deadlift       `Type: Number`
- `Field 6`:     Favorite Brands       `Type: [String]`

Schema: 
```javascript
{
    name: String,
    weight_class: String,
    squat: Number,
    bench: Number,
    deadlift: Number
    favorite_brands: [String]
}
```

### 2. Add New Data

(I used Postman to test my POST requests. Using Postman, every value was automatically treated as a String, even without wrapping the value in quotes. My example POST request reflects this as every value is simply just written, not wrapped in quotes or treating favorite_brands as an array. Once the data is received, it is then properly formatted.)
(Favorite brands only separated by comma, no spaces.)

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
       name: Brandon,
       weight_class: 83kg,
       squat: 335,
       bench: 245,
       deadlift: 405,
       favorite_brands: Gymshark,Inzer
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getPowerlifters`
GET endpoint route, filter by weight class: `api/weight_class/:weight_class`
GET endpoint route, filter by name: `api/name/:name`
GET endpoint route, filter by minimum amount for a specific lift: `api/:lift/minimum/:minimum`
GET endpoint route, filter by minimum amount for combined total: `api/total/minimum/:minimum`


### 4. Search Data

Search Field: `name`

### 5. Navigation Pages

Navigation Filters
1. Heaviest Squats -> `/heaviest_squats`
2. Heaviest Benches -> `/heaviest_benches`
3. Heaviest Deadlifts -> `/heaviest_deadlifts`
4. Heaviest Totals -> `/heaviest_totals`
5. Alphabetical Powerlifters -> `/alphabetical`

