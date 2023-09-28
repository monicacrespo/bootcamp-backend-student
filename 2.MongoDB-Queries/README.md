# Documental - Module 2 - MongoDB Queries
1. [Introduction](#introduction)
2. [Preparing the Sample Database](#exercise)
3. [How to run mongo shell in docker container?](#shell)
4. [Essential queries](#essential)
5. [Advanced queries](#advanced)
6. [Challenge query](#challenge)

<a name="introduction"></a>
## 1. Introduction
The aim of this lab is to use some of the concepts learnt during the bootcamp backend sessions given by [Lemoncode](https://lemoncode.net/lemoncode-blog/2021/12/2/bootcamp-back-end-lemoncode-ii-edicion) such as Query & Projection Operators, Logical Query Operators ($and, $or), Agregation Pipeline Stages ($group), MongoDB limit, MongoDB sort and query Modifiers. 

Follow the instructions stored [here](doc/99-laboratorio.pdf).

<a name="exercise"></a>
## 2. Preparing the Sample Database
To explain how to create queries in MongoDB — including how to filter documents with multiple fields, nested documents, and arrays — this lab uses an airbnb database example containing a compilation of vacation home listings and reviews available on [Inside AirBnB](http://insideairbnb.com/get-the-data/).

To restore the above sample collection, please follow [these instructions] (https://github.com/monicacrespo/bootcamp-backend-student-documental-rest-api/blob/main/rest_api_rentals/README.md#mongodb).

This example document describes a vacation home listings and reviews:
```
{
   "_id":"10006546",
   "listing_url":"https://www.airbnb.com/rooms/10006546",
   "name":"Ribeira Charming Duplex",
   "summary":"Fantastic duplex apartment with three bedrooms, located in the historic area of Porto, Ribeira (Cube) - UNESCO World Heritage Site. Centenary building fully rehabilitated, without losing their original character.",
   "description":"Fantastic duplex apartment with three bedrooms, located in the historic area of Porto, Ribeira (Cube) - UNESCO World Heritage Site. Centenary building fully rehabilitated, without losing their original character. Privileged views of the Douro River and Ribeira square, our apartment offers the perfect conditions to discover the history and the charm of Porto. Apartment comfortable, charming, romantic and cozy in the heart of Ribeira. Within walking distance of all the most emblematic places of the city of Porto. The apartment is fully equipped to host 8 people, with cooker, oven, washing machine, dishwasher, microwave, coffee machine (Nespresso) and kettle. The apartment is located in a very typical area of the city that allows to cross with the most picturesque population of the city, welcoming, genuine and happy people that fills the streets with his outspoken speech and contagious with your sincere generosity, wrapped in a only parochial spirit. We are always available to help guests",  
   "property_type":"House",
   "room_type":"Entire home/apt",
   "bed_type":"Real Bed",
   "accommodates":8,
   "bedrooms":3,
   "beds":5,
   "number_of_reviews":51,
   "bathrooms":{
      "$numberDecimal":"1.0"
   },
   "amenities":[
      "TV",
      "Cable TV",
      "Wifi",
      "Kitchen",
      "Paid parking off premises",    
      "Pets allowed"   
   ],
   "price":{
      "$numberDecimal":"80.00"
   },
    "address":{
      "street":"Porto, Porto, Portugal",
      "suburb":"",
      "government_area":"Cedofeita, Ildefonso, Sé, Miragaia, Nicolau, Vitória",
      "market":"Porto",
      "country":"Portugal",
      "country_code":"PT"    
   },
    "review_scores":{
      "review_scores_accuracy":9,
      "review_scores_cleanliness":9,
      "review_scores_checkin":10,
      "review_scores_communication":10,
      "review_scores_location":10,
      "review_scores_value":9,
      "review_scores_rating":89
   },
   "reviews":[
      {
         "_id":"58663741",
         "date":{
            "$date":"2016-01-03T05:00:00.000Z"
         },
         "listing_id":"10006546",
         "reviewer_id":"51483096",
         "reviewer_name":"Cátia",
         "comments":"A casa da Ana e do Gonçalo foram o local escolhido para a passagem de ano com um grupo de amigos. Fomos super bem recebidos com uma grande simpatia e predisposição a ajudar com qualquer coisa que fosse necessário.\r\nA casa era ainda melhor do que parecia nas fotos, totalmente equipada, com mantas, aquecedor e tudo o que pudessemos precisar.\r\nA localização não podia ser melhor! Não há melhor do que acordar de manhã e ao virar da esquina estar a ribeira do Porto."
      },
	  ...
	 ]
}
```
<a name="shell"></a>
## 3. How to run mongo shell in docker container?
Once we've got a MongoDB Docker container running in background, using Bash terminal execute `mongosh` command in the `listings-and-reviews-db` directly in your shell.

```
$ docker ps : list all running instances. 
| CONTAINER ID  | IMAGE             | COMMAND           | CREATED   | STATUS    |PORTS |NAMES |
| --------------| ------------------|-------------------|-----------|-----------|------|------|
| 156c91ab201c  | mongo:5.0.9       |"docker-entrypoint.s…"|13 minutes ago|Up 13 minutes|0.0.0.0:27017->27017/tcp|listings-and-reviews-db|
```
```
$ docker exec -it listings-and-reviews-db sh
# mongosh
Current Mongosh Log ID: 64933b823bfc9cc067279d81
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.0
Using MongoDB:          5.0.9
Using Mongosh:          1.5.0
test> show dbs
admin   40.00 KiB
airbnb  51.93 MiB
config  36.00 KiB
local   72.00 KiB
test> use airbnb
switched to db airbnb
airbnb>
airbnb> show collections
listingsAndReviews
airbnb> db.listingsAndReviews.countDocuments({ "address.country": { $eq: "Spain" } } );
633
airbnb>
```

<a name="essential"></a>
## 4. Essential queries

1. If you were using a real site, what potential issues you foresee in the way the information is stored?

  Storing large documents in your database can lead to excessive RAM and bandwidth usage. MongoDB keeps frequently accessed data, referred to as the working set, in RAM. When the working set grows beyond the RAM allotment, performance is degraded as data must be retrieved from disk instead.

  If your most frequent queries are for documents that contain much more information than you need for that query, consider restructuring your schema with smaller documents using references to additional collections. By breaking up your data into more collections and using smaller documents for frequently accessed data, you reduce the overall size of the working set and improve performance.

2. Get how many apartments there are in Spain
  ```
  use('listingsAndReviews');
  db.listingsAndReviews.countDocuments({ "address.country": { $eq: "Spain" } } );
  ```

  ```
  // Result
  633
  ```

3. Get the first 10 records sorted by price. The fields that need to be displayed are: name, beds, price, government_area

  ```
  use('listingsAndReviews');
  db.listingsAndReviews.find(
      { "address.country": { $eq: "Spain" } }, 
      { _id: 0, name: 1, beds: 1, price: 1, government_area: "$address.government_area" } 
      ).sort({price: 1, _id: 1}).limit(10)
  ```

  ```
  // Result
  [
    {
      "name": "Cómoda Habitación L'Eixample, Gracia",
      "beds": 2,
      "price": {
        "$numberDecimal": "10.00"
      },
      "government_area": "la Nova Esquerra de l'Eixample"
    },
    ...
    {
      "name": "Bright room in sagrada familia",
      "beds": 2,
      "price": {
        "$numberDecimal": "15.00"
      },
      "government_area": "la Sagrada Família"
    }
  ]
  ```
  Since the _id field is always guaranteed to contain exclusively unique values, the returned sort order will always be the same across multiple executions of the same sort.

4. We want to comfortably travel, we are four people and we want four beds and two toilets.

  ```
  use('listingsAndReviews');
  db.listingsAndReviews.find({ 
  $and: [
        {"beds": {$eq: 4}},
        {"bathrooms": {$eq: 2}}
  ]
  },{ _id: 0, name: 1, beds: 1, bathrooms: 1, price: 1}
  );
  ```
  Another option without $and would be as follows:
  ```
  db.listingsAndReviews.find(
    { beds: { $eq: 4 }, bathrooms: { $gte: 2 } },
    { _id: 0, name: 1, beds: 1, bathrooms: 1, price: 1 }
  );
  ```
  ```
  // Result
  [
    {
      "name": "Waterfront, Enchanted Lake Home 2/1",
      "beds": 4,
      "bathrooms": {
        "$numberDecimal": "2.0"
      },
      "price": {
        "$numberDecimal": "189.00"
      }
    },
    ...
  ]
  ```
  ```
  use('listingsAndReviews');
  db.listingsAndReviews.countDocuments({ 
  $and: [
        {"beds": {$eq: 4}},
        {"bathrooms": {$eq: 2}}
  ]
  });
  ```
  ```
  // Result
  132
  ```


5. Besides, we like the apartment to come with WIFI
  Using $all operator to select the documents where the value of a field is an array that contains all the specified elements. https://www.mongodb.com/docs/manual/reference/operator/query/#array

  ```
  use('listingsAndReviews');
  db.listingsAndReviews.find({ 
  $and: [
        {"beds": {$eq: 4}},
        {"bathrooms": {$eq: 2}},
        {"amenities": { $all: ["Wifi"] } }
  ]
  },{ _id: 0, name: 1, beds: 1, bathrooms: 1, amenities: 1, price: 1}
  );
  ```

  ```
  // Result
  [
    {
      "name": "Waterfront, Enchanted Lake Home 2/1",
      "beds": 4,
      "bathrooms": {
        "$numberDecimal": "2.0"
      },
      "amenities": [
        "TV",
        "Internet",
        "Wifi",
        "Air conditioning",
        "Wheelchair accessible",
        "Kitchen",
        "Free parking on premises",
        "Free street parking",
        "Family/kid friendly",
        "Washer",
        "Dryer",
        "Smoke detector",
        "Carbon monoxide detector",
        "Essentials",
        "24-hour check-in",
        "Hangers",
        "Hair dryer",
        "Iron",
        "Self check-in",
        "Keypad",
        "Private entrance",
        "Hot water",
        "Bed linens",
        "Extra pillows and blankets",
        "Microwave",
        "Coffee maker",
        "Refrigerator",
        "Stove",
        "Patio or balcony",
        "Long term stays allowed"
      ],
      "price": {
        "$numberDecimal": "189.00"
      }
    },
    ...
  ]
  ```
  If we use countDocuments, the result is 131.

6. Besides, a friend with a dog has joined, so, we would need an apartment with Pets Allowed

  ```
  use('listingsAndReviews');
  db.listingsAndReviews.find({ 
  $and: [
        {"beds": {$eq: 4}},
        {"bathrooms": {$eq: 2}},
        {"amenities": { $all: ["Wifi", "Pets allowed"] } }
  ]
  },{ _id: 0, name: 1, beds: 1, bathrooms: 1, amenities: 1, price: 1}
  );
  ```

  ```
  // Result
  [
    {
      "name": "Penthouse. Terrace.",
      "beds": 4,
      "bathrooms": {
        "$numberDecimal": "2.0"
      },
      "amenities": [
        "TV",
        "Internet",
        "Wifi",
        "Air conditioning",
        "Wheelchair accessible",
        "Kitchen",
        "Paid parking off premises",
        "Pets allowed",
        "Elevator",
        "Buzzer/wireless intercom",
        "Heating",
        "Family/kid friendly",
        "Washer",
        "Dryer",
        "Smoke detector",
        "Carbon monoxide detector",
        "Fire extinguisher",
        "Essentials",
        "Shampoo",
        "24-hour check-in",
        "Hangers",
        "Hair dryer",
        "Iron",
        "Laptop friendly workspace",
        "High chair",
        "Children’s books and toys",
        "Crib",
        "Pack ’n Play/travel crib",
        "Hot water",
        "Microwave",
        "Coffee maker",
        "Refrigerator",
        "Dishwasher",
        "Dishes and silverware",
        "Cooking basics",
        "Oven",
        "Stove",
        "Long term stays allowed",
        "Host greets you",
        "Paid parking on premises"
      ],
      "price": {
        "$numberDecimal": "87.00"
      }
    },
    ...
  ]
  ```
  If we use countDocuments, the result is 17.

7. We are between going to Barcelona or Portugal, but we want the price to be cheap (50 $), and a good review scores rating.

  ```
  use('listingsAndReviews');
  db.listingsAndReviews.find({ 
  $and: [
        {"price": { $eq: 50 } },
        {"review_scores.review_scores_rating": {$gt: 9}},      
        {
        $or: [
              { "address.market": { $eq: "Barcelona" } },
              { "address.country": { $eq: "Portugal" } }            
              ]
        }
  ]
  },
  { _id: 0, name: 1, "address.country": 1, "address.market": 1, price: 1, review_score_rating: "$review_scores.review_scores_rating"}
  );
  ```

  ```
  // Result
  [
    {
      "name": "B. Arts IV",
      "price": {
        "$numberDecimal": "50.00"
      },
      "address": {
        "market": "Porto",
        "country": "Portugal"
      },
      "review_score_rating": 100
    },
    {
      "name": "The Porto Concierge - White Martin",
      "price": {
        "$numberDecimal": "50.00"
      },
      "address": {
        "market": "Porto",
        "country": "Portugal"
      },
      "review_score_rating": 90
    },
    ...
  ]
  ```
  If we use countDocuments, the result is 53.

8. Get the apartments in Spain with the following fields using aggregations:
  * Name
  * City (we dont want to display an object, only the string with the city)
  * Price 

  ```
  use('listingsAndReviews');
  db.listingsAndReviews.aggregate([  
    { $match: { "address.country": { $eq: "Spain" } } },
    { $project: { _id: 0, name: 1, city: "$address.market", price: 1} }
  ])
  ```

  ```
  // Result
  [
    {
      "name": "Nice room in Barcelona Center",
      "price": {
        "$numberDecimal": "50.00"
      },
      "city": "Barcelona"
    },
    {
      "name": "Cozy bedroom Sagrada Familia",
      "price": {
        "$numberDecimal": "20.00"
      },
      "city": "Barcelona"
    },
    ...
  ]
  ```

9. Get how many listings are available per country using aggregations
  ```
  use('listingsAndReviews');
  db.listingsAndReviews.aggregate([
    {
      $unwind: "$address.country"
    },
    {
      $group: {
        _id: { country: "$address.country" },
        countNumberOfDocumentsForCountry: { $count: {} }
        }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ])
  ```
  Another option using $sum would be as follows:
  ```
  db.listingsAndReviews.aggregate([
  {
      $group: {
        _id: "$address.country",
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  ```

  ```
  // Result
  [
    {
      "_id": {
        "country": "Australia"
      },
      "countNumberOfDocumentsForCountry": 610
    },
    {
      "_id": {
        "country": "Brazil"
      },
      "countNumberOfDocumentsForCountry": 606
    },
    {
      "_id": {
        "country": "Canada"
      },
      "countNumberOfDocumentsForCountry": 649
    },
    {
      "_id": {
        "country": "China"
      },
      "countNumberOfDocumentsForCountry": 19
    },
    {
      "_id": {
        "country": "Hong Kong"
      },
      "countNumberOfDocumentsForCountry": 600
    },
    {
      "_id": {
        "country": "Portugal"
      },
      "countNumberOfDocumentsForCountry": 555
    },
    {
      "_id": {
        "country": "Spain"
      },
      "countNumberOfDocumentsForCountry": 633
    },
    {
      "_id": {
        "country": "Turkey"
      },
      "countNumberOfDocumentsForCountry": 661
    },
    {
      "_id": {
        "country": "United States"
      },
      "countNumberOfDocumentsForCountry": 1222
    }
  ]
  ```
<a name="advanced"></a>
## 5. Advanced queries

1. We would like to know the average price of renting on airbnb in Spain

    ```
    use('listingsAndReviews');
    db.listingsAndReviews.aggregate([
    { $match: { "address.country": { $eq: "Spain" } } },  
    {
        $group: {
        _id: { country: "$address.country" },
        averagePrice: { $avg: "$price" }
        }
    }
    ])
    ```

    ```
    // Result
    [
    {
        "_id": {
        "country": "Spain"
        },
        "averagePrice": {
            "$numberDecimal": "100.8262243285939968404423380726698"
        }
    }
    ]
    ```
2. We would like to know the average price of renting on airbnb grouped by country

```
use('listingsAndReviews');
  db.listingsAndReviews.aggregate([    
    {
      $group: {
        _id: { country: "$address.country" },
        averagePrice: { $avg: "$price" }
        }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ])
```
```
// Result
[
  {
    "_id": {
      "country": "Portugal"
    },
    "averagePrice": {
      "$numberDecimal": "69.18198198198198198198198198198198"
    }
  },
  {
    "_id": {
      "country": "Spain"
    },
    "averagePrice": {
      "$numberDecimal": "100.8262243285939968404423380726698"
    }
  },
  {
    "_id": {
      "country": "United States"
    },
    "averagePrice": {
      "$numberDecimal": "185.7692307692307692307692307692308"
    }
  },
  {
    "_id": {
      "country": "Brazil"
    },
    "averagePrice": {
      "$numberDecimal": "525.3465346534653465346534653465347"
    }
  },
  {
    "_id": {
      "country": "Hong Kong"
    },
    "averagePrice": {
      "$numberDecimal": "773.7866666666666666666666666666667"
    }
  },
  ...
]
```

3. We would like to know the average price of renting on airbnb grouped by country and number of rooms

```
use('listingsAndReviews');
  db.listingsAndReviews.aggregate([    
    {
      $group: {
        _id: {            
            country: "$address.country",
            bedrooms: "$bedrooms"
        },
        averagePrice: { $avg: "$price" }
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ])
```
```
// Result
[
  {
    "_id": {
      "country": "Australia"
    },
    "averagePrice": {
      "$numberDecimal": "70.00"
    }
  },
  {
    "_id": {
      "country": "Australia",
      "bedrooms": 0
    },
    "averagePrice": {
      "$numberDecimal": "125.6222222222222222222222222222222"
    }
  },
  {
    "_id": {
      "country": "Australia",
      "bedrooms": 1
    },
    "averagePrice": {
      "$numberDecimal": "114.7041420118343195266272189349112"
    }
  },
  {
    "_id": {
      "country": "Australia",
      "bedrooms": 2
    },
    "averagePrice": {
      "$numberDecimal": "218.0757575757575757575757575757576"
    }
  },
  {
    "_id": {
      "country": "Australia",
      "bedrooms": 3
    },
    "averagePrice": {
      "$numberDecimal": "393.7391304347826086956521739130435"
    }
  },
  {
    "_id": {
      "country": "Australia",
      "bedrooms": 4
    },
    "averagePrice": {
      "$numberDecimal": "555.6470588235294117647058823529412"
    }
  },
  {
    "_id": {
      "country": "Australia",
      "bedrooms": 5
    },
    "averagePrice": {
      "$numberDecimal": "732.9090909090909090909090909090909"
    }
  },
  {
    "_id": {
      "country": "Australia",
      "bedrooms": 6
    },
    "averagePrice": {
      "$numberDecimal": "814.00"
    }
  },
  {
    "_id": {
      "country": "Australia",
      "bedrooms": 7
    },
    "averagePrice": {
      "$numberDecimal": "689.00"
    }
  },
  {
    "_id": {
      "country": "Brazil",
      "bedrooms": 0
    },
    "averagePrice": {
      "$numberDecimal": "295.1428571428571428571428571428571"
    }
  },
  {
    "_id": {
      "country": "Brazil",
      "bedrooms": 1
    },
    "averagePrice": {
      "$numberDecimal": "270.9339622641509433962264150943396"
    }
  },
  ...
]
```
<a name="challenge"></a>
## 6. Challenge query
We would like to show the top 5 apartments more expensive in Spain, with the following fields:
  * Name
  * City.
  * Amenities, but instead of an array, un string with all the amenities

    ```
    use('listingsAndReviews');
    db.listingsAndReviews.aggregate([
    { 
    $match: { 
        "address.country": { $eq: "Spain" },
        property_type: { $eq: "Apartment" }
    }
    }, 
    {
    $sort: {
        price: -1
    }
    },
    { 
    $limit : 5 
    },
    { 
    $project: { 
        _id: 0, 
        name: 1, 
        city: "$address.country",  
        amenities: {
                $reduce: {
                    input: "$amenities",
                    initialValue: "",
                    in: { 
                    $concat: [
                        "$$value",
                        {
                        $cond: {
                            if: { $eq: [ "$$value", "" ] },
                            then: "",
                            else: ", "
                        }
                        }, 
                        "$$this" 
                        ] 
                    }
                }
        }
    } 
    }
    ])
    ```
    ```
    // Result 
    [
    {
        "name": "Room in the center of Barcelona",
        "city": "Spain",
        "amenities": "TV, Wifi, Air conditioning, Kitchen, Smoking allowed, Heating, Washer, Essentials, Shampoo, Hangers"
    },
    {
        "name": "Ático exclusivo Barcelona",
        "city": "Spain",
        "amenities": "TV, Internet, Wifi, Air conditioning, Pool, Kitchen, Elevator, Family/kid friendly, Washer, Dryer, Essentials, Shampoo, Hangers, Hair dryer, Iron, Laptop friendly workspace, Hot water, Long term stays allowed, Host greets you, Paid parking on premises"
    },
    {
        "name": "1405 - LUXURY BEACH TERRACE APARTME",
        "city": "Spain",
        "amenities": "TV, Internet, Wifi, Air conditioning, Wheelchair accessible, Pool, Kitchen, Smoking allowed, Gym, Elevator, Buzzer/wireless intercom, Heating, Family/kid friendly, Suitable for events, Washer, Dryer, Essentials"
    },
    {
        "name": "Casa Batlló views! Central apartment¦",
        "city": "Spain",
        "amenities": "TV, Cable TV, Internet, Wifi, Air conditioning, Kitchen, Elevator, Buzzer/wireless intercom, Family/kid friendly, Washer, Smoke detector, Carbon monoxide detector, Essentials, Shampoo, 24-hour check-in, Hangers, Hair dryer, Iron, Laptop friendly workspace, Self check-in, Building staff, Hot water, Bed linens, Microwave, Coffee maker, Refrigerator, Dishes and silverware, Cooking basics, Oven, Stove"
    },
    {
        "name": "2714 - AB Girona Apartment 41 - Stylish Apartment for up to 7 guests in Eixample with a Balcony",
        "city": "Spain",
        "amenities": "TV, Internet, Wifi, Air conditioning, Wheelchair accessible, Kitchen, Free parking on premises, Elevator, Heating, Washer, Safety card, Essentials, Shampoo, 24-hour check-in, Hangers, Hair dryer, Iron, Hot water, Microwave, Coffee maker, Refrigerator, Dishes and silverware, Cooking basics, Oven, Patio or balcony, Luggage dropoff allowed"
    }
    ]
    ```
