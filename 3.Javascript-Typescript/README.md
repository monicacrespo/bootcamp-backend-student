# Documental - Module 3 - Javascript & Typescript
1. [Introduction](#intro)
2. [Javascript](#javascript)
3. [Typescript](#typescript)

<a name="intro"></a>
## 1. Introduction
This repository contains the solutions to the javascript & typescript exercises given by [Lemoncode](https://github.com/Lemoncode/bootcamp-backend/tree/main/00-stack-documental/03-javascript-typescript/03-ejercicios), and my solutions.

<a name="javascript"></a>
## 2. JavaScript

## Exercise 1
A text in CSV format has the name of the fields in the first row and the data in the remaining rows, separated by commas. 
Implement a parser that receives a string in CSV format and returns a collection of objects. 
Use destructuring, rest y spread operator where you feel convenient.
```
const data = `id,name,surname,gender,email,picture
15519533,Raul,Flores,male,raul.flores@example.com,https://randomuser.me/api/portraits/men/42.jpg
82739790,Alvaro,Alvarez,male,alvaro.alvarez@example.com,https://randomuser.me/api/portraits/men/48.jpg
37206344,Adrian,Pastor,male,adrian.pastor@example.com,https://randomuser.me/api/portraits/men/86.jpg
58054375,Fatima,Guerrero,female,fatima.guerrero@example.com,https://randomuser.me/api/portraits/women/74.jpg
35133706,Raul,Ruiz,male,raul.ruiz@example.com,https://randomuser.me/api/portraits/men/78.jpg
79300902,Nerea,Santos,female,nerea.santos@example.com,https://randomuser.me/api/portraits/women/61.jpg
89802965,Andres,Sanchez,male,andres.sanchez@example.com,https://randomuser.me/api/portraits/men/34.jpg
62431141,Lorenzo,Gomez,male,lorenzo.gomez@example.com,https://randomuser.me/api/portraits/men/81.jpg
05298880,Marco,Campos,male,marco.campos@example.com,https://randomuser.me/api/portraits/men/67.jpg
61539018,Marco,Calvo,male,marco.calvo@example.com,https://randomuser.me/api/portraits/men/86.jpg`;

const fromCSV = (csv) => {

};

const result = fromCSV(data);
console.log(result);

```

```
Result output:

[
  {
    id: "15519533",
    name: "Raul",
    surname: "Flores",
    gender: "male",
    email: "raul.flores@example.com",
    picture: "https://randomuser.me/api/portraits/men/42.jpg"
  },
  {
    id: "82739790",
    name: "Alvaro",
    surname: "Alvarez",
    gender: "male",
    email: "alvaro.alvarez@example.com",
    picture: "https://randomuser.me/api/portraits/men/48.jpg"
  },
  {
    ...
  }
]

```

Solution using Destructuring, Rest, Map and forEach:

```
const fromCSV = (csv) => {
    let  fieldDelimiter = ",";
    let rowDelimiter =  "\n";

    /* The split() method splits a string into an array of substrings */
    let rows = csv.split(rowDelimiter);
    
    /* Using array destructuring to extract data from an array very simple and readable.
       Also using (...) operator that was added in ES6. 
       If the (...) operator appear on the left-hand side in destructuring then it is a REST PARAMETER.
       A Rest parameter is used to map all the remaining elements in the array 
       that have not been mapped to the rest variable itself, in this case everything except the headers.
    */
    let [, ...data] = rows;

    // get headers
    const headers = rows[0].split(fieldDelimiter);
    
    return  data.map(row => {
      const values = row.trim().split(fieldDelimiter);
      let obj = {};
      headers.forEach((h, i) => obj[h] = values[i]); 
      return obj;
    });
};

```

This is the output:

```
[
  {
    id: '15519533',
    name: 'Raul',
    surname: 'Flores',
    gender: 'male',
    email: 'raul.flores@example.com',
    picture: 'https://randomuser.me/api/portraits/men/42.jpg'
  },
  {
    id: '82739790',
    name: 'Alvaro',
    surname: 'Alvarez',
    gender: 'male',
    email: 'alvaro.alvarez@example.com',
    picture: 'https://randomuser.me/api/portraits/men/48.jpg'
  },
  {
    ...
  }
]
```

Solution using Destructuring, Rest and Reduce:
```
const fromCSV = (csv) => {
    let  fieldDelimiter = ",";
    let rowDelimiter =  "\n";
    
    /* The split() method splits a string into an array of substrings */
    let rows = csv.split(rowDelimiter);
    
    let [, ...data] = rows;

    // get headers
    const headers = rows[0].split(fieldDelimiter);

    let array = data.reduce((arr, row) => {
      let innerObj = row.split(fieldDelimiter).reduce((obj, item, index) => {
        obj[headers[index]] = item;
        return obj;
      }, {});
      arr.push(innerObj);
      return arr;
    }, []);

    return array;
};
```

Plus: Add a second parameter to the function for the number of attributes to add. If that parameter is not provided, each object will have all the fields.

```
const fromCSV = (csv, nAttrs) => {};

console.log(fromCSV(data)); // Cada usuario tendrá todos los atributos como la implementación original
console.log(fromCSV(data, 2)); // cada usuario tendrá sólo `id` y `name`
console.log(fromCSV(data, 3)); // cada usuario tendrá sólo `id`, `name` y `surname`
console.log(fromCSV(data, 4)); // cada usuario tendrá sólo `id`, `name`, `surname` y `gender`
```

Solution. Just use slice (start, end) on the header fields. 
The javascript slice() method returns a portion of an array into a new array object selected from start to end where start and end represent the index of items in that array. 
The original array will not be modified.

```
const data = `id,name,surname,gender,email,picture
15519533,Raul,Flores,male,raul.flores@example.com,https://randomuser.me/api/portraits/men/42.jpg
82739790,Alvaro,Alvarez,male,alvaro.alvarez@example.com,https://randomuser.me/api/portraits/men/48.jpg
37206344,Adrian,Pastor,male,adrian.pastor@example.com,https://randomuser.me/api/portraits/men/86.jpg
58054375,Fatima,Guerrero,female,fatima.guerrero@example.com,https://randomuser.me/api/portraits/women/74.jpg
35133706,Raul,Ruiz,male,raul.ruiz@example.com,https://randomuser.me/api/portraits/men/78.jpg
79300902,Nerea,Santos,female,nerea.santos@example.com,https://randomuser.me/api/portraits/women/61.jpg
89802965,Andres,Sanchez,male,andres.sanchez@example.com,https://randomuser.me/api/portraits/men/34.jpg
62431141,Lorenzo,Gomez,male,lorenzo.gomez@example.com,https://randomuser.me/api/portraits/men/81.jpg
05298880,Marco,Campos,male,marco.campos@example.com,https://randomuser.me/api/portraits/men/67.jpg
61539018,Marco,Calvo,male,marco.calvo@example.com,https://randomuser.me/api/portraits/men/86.jpg`;

const fromCSV = (csv, nAttrs) => {
  let  fieldDelimiter = ",";
  let rowDelimiter =  "\n";

  /* The split() method splits a string into an array of substrings */
  let rows = csv.split(rowDelimiter);
  
  /* Using array destructuring to extract data from an array very simple and readable.
     Also using (...) operator that was added in ES6. 
     If the (...) operator appear on the left-hand side in destructuring then it is a REST PARAMETER.
     A Rest parameter is used to map all the remaining elements in the array 
     that have not been mapped to the rest variable itself, in this case everything except the headers.
  */
  let [, ...data] = rows;

  // get headers
  const headers = rows[0].split(fieldDelimiter).slice(0, nAttrs);
  
  return  data.map(row => {
    const values = row.trim().split(fieldDelimiter);
    let obj = {};
    headers.forEach((h, i) => obj[h] = values[i]); 
    return obj;
  });
};

const result = fromCSV(data, 2);

console.log(result);
```

```
[
  { id: '15519533', name: 'Raul' },
  { id: '82739790', name: 'Alvaro' },
  { id: '37206344', name: 'Adrian' },
  { id: '58054375', name: 'Fatima' },
  { id: '35133706', name: 'Raul' },
  { id: '79300902', name: 'Nerea' },
  { id: '89802965', name: 'Andres' },
  { id: '62431141', name: 'Lorenzo' },
  { id: '05298880', name: 'Marco' }
]
```

## Exercise 2
Implement a function replaceAt that accepts as first argument an array, as second an index and as third argument a value and replace the element in the array in the index provided. 
The input array must not be mutted, that means, you need to create a new array without modifying the original one. Use spread operator, and slice to get it.

```
const elements = ["lorem", "ipsum", "dolor", "sit", "amet"];
const index = 2;
const newValue = "furor";

const replaceAt = (arr, index, newElement) => {

};

const result = replaceAt(elements, index, newValue);
console.log(result === elements); // false
console.log(result); // ['lorem', 'ipsum', 'furor', 'sit', 'amet'];
```

Solution using spread syntax
```
const replaceAt = (arr, index, newElement) => {
    const copy = [...arr]; 
    if (index !== -1) {
        copy[index] = newElement;
    }
    return copy;
};
```
Solution using slice method 
```
const replaceAt = (arr, index, newElement) => {    
    const copy = arr.slice();
    if (index !== -1) {       
        copy[index] = newElement;
    }
    return copy;
};
```
## Exercise 3
Creates a function that receives an object's collection and a year. That function should display the names of the three people with the highest ranking of the year.

```
const data = [
  { ranking: 6.3, year: 1998, name: "Monroe", gender: "Genderfluid", id: 1450, surname: "Jerde" },
  { ranking: 5.4, year: 1999, name: "Maxie", gender: "Bigender", id: 1652, surname: "Keebler" },
  { ranking: 8.7, year: 2000, name: "Emilee", gender: "Genderqueer", id: 4779, surname: "Ritchie" },
  { ranking: 6.5, year: 2001, name: "Rudy", gender: "Bigender", id: 7105, surname: "Gusikowski" },
  { ranking: 7.1, year: 1998, name: "Randy", gender: "Genderqueer", id: 5950, surname: "Lebsack" },
  { ranking: 4.9, year: 2000, name: "Esteban", gender: "Genderqueer", id: 7987, surname: "Fritsch" },
  { ranking: 5.3, year: 2001, name: "Leonard", gender: "Male", id: 6268, surname: "Frami" },
  { ranking: 8.8, year: 2002, name: "Lang", gender: "Polygender", id: 1033, surname: "Dietrich" },
  { ranking: 9.1, year: 2000, name: "Lettie", gender: "Agender", id: 6403, surname: "Gutmann" },
  { ranking: 6.0, year: 1998, name: "Shonda", gender: "Agender", id: 1324, surname: "Borer" },
  { ranking: 7.3, year: 2003, name: "Francene", gender: "Agender", id: 6836, surname: "Blanda" },
  { ranking: 6.8, year: 2003, name: "Everett", gender: "Polygender", id: 4937, surname: "O'Keefe" },
  { ranking: 5.3, year: 1998, name: "Bernardo", gender: "Agender", id: 8148, surname: "Baumbach" },
  { ranking: 9.3, year: 2003, name: "Brianna", gender: "Female", id: 7716, surname: "Schamberger" },
  { ranking: 9.7, year: 1998, name: "Douglass", gender: "Male", id: 4152, surname: "Hilpert" },
  { ranking: 4.8, year: 1998, name: "Angel", gender: "Female", id: 355, surname: "O'Hara" },
  { ranking: 5.7, year: 2000, name: "Hugh", gender: "Male", id: 9600, surname: "Hilll" },
  { ranking: 8.5, year: 1999, name: "Graciela", gender: "Agender", id: 871, surname: "Kerluke" },
  { ranking: 2.4, year: 2000, name: "Chassidy", gender: "Agender", id: 4313, surname: "Hegmann" },
  { ranking: 3.4, year: 1999, name: "Abdul", gender: "Agender", id: 367, surname: "Weimann" },
  { ranking: 7.1, year: 2002, name: "Coleen", gender: "Non-binary", id: 1428, surname: "Feil" },
  { ranking: 8.7, year: 2001, name: "Eleanora", gender: "Genderfluid", id: 984, surname: "Barton" },
  { ranking: 9.7, year: 2002, name: "Sean", gender: "Agender", id: 5689, surname: "Runolfsson" },
  { ranking: 4.5, year: 1999, name: "Ike", gender: "Female", id: 8445, surname: "Haag" },
  { ranking: 7.7, year: 2001, name: "Rachele", gender: "Genderqueer", id: 6978, surname: "Grady" },
  { ranking: 9.1, year: 2001, name: "Sam", gender: "Bigender", id: 1321, surname: "Fritsch" },
  { ranking: 9.0, year: 2000, name: "Eddy", gender: "Polygender", id: 8273, surname: "Kemmer" },
  { ranking: 4.6, year: 1999, name: "Jamar", gender: "Female", id: 6052, surname: "Grant" },
  { ranking: 9.3, year: 2001, name: "Dino", gender: "Genderfluid", id: 5671, surname: "Erdman" },
  { ranking: 7.6, year: 1999, name: "Ervin", gender: "Non-binary", id: 9945, surname: "Powlowski" }
];

const winnerByYear = (arr, year) => {

};

console.log(winnerByYear(data, 1998)) // [ 'Douglass', 'Randy', 'Monroe' ]
console.log(winnerByYear(data, 1999)) // [ 'Graciela', 'Ervin', 'Maxie' ]
console.log(winnerByYear(data, 2000)) // [ 'Lettie', 'Eddy', 'Emilee' ]
console.log(winnerByYear(data, 2001)) // [ 'Dino', 'Sam', 'Eleanora' ]
console.log(winnerByYear(data, 2002)) // [ 'Sean', 'Lang', 'Coleen' ]
console.log(winnerByYear(data, 2003)) // [ 'Brianna', 'Francene', 'Everett' ]
console.log(winnerByYear(data, 2004)) // []
```

Solution
```
 const winnerByYear = (arr, year) => {
    return arr.filter(o => o.year === year).sort(function(a , b) {
	  // sorting by highest ranking
      return b.ranking - a.ranking;
    }).slice(0,3).map(o => o.name);
  
 };
```
## Exercise 4
Create a function to normalize an object's collection to an object, so that the return object has:
* the id value as a key and 
* the object without the id as its value.

```
const collection = [
  {
    id: "f0b6930c-331a-43e1-80db-e6c46ed552aa",
    nationality: "Barbadians",
    language: "English",
    capital: "Belgrade",
    national_sport: "taekwondo",
    flag: "ID",
  },
  {
    id: "3e690823-fc74-4376-999a-501e5f9ae4be",
    nationality: "Congolese",
    language: "German",
    capital: "Kinshasa",
    national_sport: "wrestling",
    flag: "UY",
  },
  {
    id: "9edd87d6-2f4f-4701-8ec4-272a361dbfe9",
    nationality: "Libyans",
    language: "Tagalog",
    capital: "Jakarta",
    national_sport: "buzkashi",
    flag: "GW",
  },
  {
    id: "9873a1ed-6dc5-4034-8214-1f428c8951bd",
    nationality: "Guineans",
    language: "Hakka",
    capital: "Ankara",
    national_sport: "gymnastics",
    flag: "TR",
  },
  {
    id: "4679c4a4-4e2e-4470-a900-2445dc1f4a1e",
    nationality: "Ugandans",
    language: "German",
    capital: "Beijing",
    national_sport: "dandi biyo",
    flag: "IN",
  },
  {
    id: "4274ad62-5089-4b8e-a002-b2c1c3c74926",
    nationality: "Finns",
    language: "Swedish",
    capital: "Djibouti",
    national_sport: "bull fighting",
    flag: "HM",
  },
  {
    id: "2bb25c20-7962-47b7-82d9-d62a9493308f",
    nationality: "Poles",
    language: "Swedish",
    capital: "Beirut",
    national_sport: "cricket",
    flag: "KH",
  },
  {
    id: "9b3e09da-7484-49f3-aed0-13ccc7e77fff",
    nationality: "Guineans",
    language: "Portuguese",
    capital: "Guatemala City",
    national_sport: "cricket",
    flag: "DE",
  },
  {
    id: "903fb062-647c-46f8-857f-c1eba0cbbc9b",
    nationality: "Ivoirians",
    language: "Nepali",
    capital: "Juba",
    national_sport: "cricket",
    flag: "FI",
  },
  {
    id: "21bcd231-1d8f-49f5-826a-1dc986c52f0d",
    nationality: "Hungarians",
    language: "Russian",
    capital: "Tarawa Atoll",
    national_sport: "gymnastics",
    flag: "MO",
  },
];

const normalize = (arr) => {

};

const result = normalize(collection);
console.log(result);

```

```
// Result:
{
  "f0b6930c-331a-43e1-80db-e6c46ed552aa": {
    nationality: "Barbadians",
    language: "English",
    capital: "Belgrade",
    national_sport: "taekwondo",
    flag: "🇮🇩"
  },
  "3e690823-fc74-4376-999a-501e5f9ae4be": {
    nationality: "Congolese",
    language: "German",
    capital: "Kinshasa",
    national_sport: "wrestling",
    flag: "🇺🇾"
  },
  ...
}
```
Optional: If your solution does use loops, create a solution without them, based on Array.prototype functionals methods

Solution using Reduce, Destructuring and Rest operators
```
const normalize = (arr) => {
  const result = arr.reduce((obj, item) => 
  {
    // Using destructuring and rest to remove the id from the object "item" in an immutable way.
    // The original object "item" remains intact.
    const { id, ...country } = item;
 
    obj[id] = country;
    return obj;
  }, {});

  return result;
};
```


## Exercise 5
Implement a function to remove falsys values from a data structure.
* If the argument is an object, it should remove its falsys properties. 
* If the argument is an array, it should remove its falsys elements. 
* If the argument is an array or an object, these should no be mutated.
* It always should create a new structure. 
* If it is not an object or an array it should return the argument itself.

```
const elements = [0, 1, false, 2, "", 3];

const compact = (arg) => {

};

console.log(compact(123)); // 123
console.log(compact(null)); // null
console.log(compact([0, 1, false, 2, "", 3])); // [1, 2, 3]
console.log(compact({})); // {}
console.log(compact({ price: 0, name: "cloud", altitude: NaN, taste: undefined, isAlive: false })); // {name: "cloud"}
```
```
// Solution
const removeFalsyElement = object => {
   const newObject = {};
   Object.keys(object).forEach(key => {
     if (object[key]) {
       newObject[key] = object[key];
     }
   });
   return newObject;
 };

// Note: There are only six falsy values in JavaScript: undefined , null , NaN , 0 , "", and false.
const compact = (arg) => {
   if (Array.isArray(arg))
   {
      const [ ...newArray ] = arg;
      // filter returns a new array with the elements that pass the test.
	  // If no elements pass the test, an empty array will be returned.
	   return result = newArray.filter(Boolean);
   }
   
   // Note that an array is an "object" type as well. 
   // This is why the first check is to find out whether the argument is an array or not.
   if (typeof arg === 'object' && arg !== null)
   {
      return removeFalsyElement(arg);
   }
   
   return arg;
};
```

<a name="typescript"></a>
## 3. Typescript
## Exercise 1
Given the below code snippet, creates the Student interface and use it to replace the unknown:
```
const students: unknown = [
  {
    name: "Patrick Berry",
    age: 25,
    occupation: "Medical scientist",
  },
  {
    name: "Alice Garner",
    age: 34,
    occupation: "Media planner",
  },
];

const logStudent = ({ name, age }: unknown) => {
  console.log(`  - ${name}, ${age}`);
};

console.log("Students:");
students.forEach(logStudent);

```
Solution
```
interface Student {
  name: string;
  age: number;
  occupation: string;
}
  
const students: Student[] = [
  {
    name: "Patrick Berry",
    age: 25,
    occupation: "Medical scientist",
  },
  {
    name: "Alice Garner",
    age: 34,
    occupation: "Media planner",
  },
];
  
const logStudent = ({ name, age }: Student) => {
  console.log(`  - ${name}, ${age}`);
};

console.log("Students:");
students.forEach(logStudent);
```
Result output:
```
Students:
  - Patrick Berry, 25
  - Alice Garner, 34

```


## Exercise 2
Using the Student interface from previous exercise, creates the User definition so that it can be Student or Teacher.
Apply the User definition where required to fix the type errors.

```
interface Teacher {
  name: string;
  age: number;
  subject: string;
}

const users: Teacher[] = [
  {
    name: "Luke Patterson",
    age: 32,
    occupation: "Internal auditor",
  },
  {
    name: "Jane Doe",
    age: 41,
    subject: "English",
  },
  {
    name: "Alexandra Morton",
    age: 35,
    occupation: "Conservation worker",
  },
  {
    name: "Bruce Willis",
    age: 39,
    subject: "Biology",
  },
];

const logUser = ({ name, age }: Teacher) => {
  console.log(`  - ${name}, ${age}`);
};

users.forEach(logUser);
```

Solution 
```
interface Person {
  name: string;
  age: number;
}

interface Student extends Person {
  occupation: string;
}

interface Teacher extends Person {
  subject: string;
}

type User = Student | Teacher;

const users: User[] = [
  {
    name: "Luke Patterson",
    age: 32,
    occupation: "Internal auditor",
  },
  {
    name: "Jane Doe",
    age: 41,
    subject: "English",
  },
  {
    name: "Alexandra Morton",
    age: 35,
    occupation: "Conservation worker",
  },
  {
    name: "Bruce Willis",
    age: 39,
    subject: "Biology",
  },
];

const logUser = ({ name, age }: User) => {
  console.log(`  - ${name}, ${age}`);
};

users.forEach(logUser);
```

Result output:
```
  - Luke Patterson, 32
  - Jane Doe, 41
  - Alexandra Morton, 35
  - Bruce Willis, 39
```

Another solution might be using optional properties like the following:
```
interface User {
  name: string;
  age: number;
  occupation?: string;
  subject?: string;
}

const users: User[] = [
  {
    name: "Luke Patterson",
    age: 32,
    occupation: "Internal auditor",
  },
  {
    name: "Jane Doe",
    age: 41,
    subject: "English",
  },
  {
    name: "Alexandra Morton",
    age: 35,
    occupation: "Conservation worker",
  },
  {
    name: "Bruce Willis",
    age: 39,
    subject: "Biology",
  },
];

const logUser = ({ name, age }: User) => {
  console.log(`  - ${name}, ${age}`);
};

users.forEach(logUser);
```
More information here https://www.typescriptlang.org/docs/handbook/2/objects.html#Property-Modifiers

## Exercise 3
With the result of exercise 2, replace the logUser function for the below one, and modify the code applying the guards to fix the compilation errors.

```
const logUser = (user: User) => {
  let extraInfo: string;
  if (user.occupation) {
    extraInfo = user.occupation;
  } else {
    extraInfo = user.subject;
  }
  console.log(`  - ${user.name}, ${user.age}, ${extraInfo}`);
};
```

Solution
```
 interface Person {
  name: string;
  age: number;
}

interface Student extends Person {
  occupation: string;
}

interface Teacher extends Person {
  subject: string;
}

type User = Student | Teacher;

const users: User[] = [
  {
    name: "Luke Patterson",
    age: 32,
    occupation: "Internal auditor",
  },
  {
    name: "Jane Doe",
    age: 41,
    subject: "English",
  },
  {
    name: "Alexandra Morton",
    age: 35,
    occupation: "Conservation worker",
  },
  {
    name: "Bruce Willis",
    age: 39,
    subject: "Biology",
  },
];

const logUser = (user: User) => {
  let extraInfo: string;
  if ("occupation" in user) {
    extraInfo = user.occupation;
  } else {
    extraInfo = user.subject;
  }
  console.log(`  - ${user.name}, ${user.age}, ${extraInfo}`);
};

users.forEach(logUser);
```
Result output:
```
  - Luke Patterson, 32, Internal auditor
  - Jane Doe, 41, English
  - Alexandra Morton, 35, Conservation worker
  - Bruce Willis, 39, Biology
```
## Exercise 4
Using the same Student interface from previous exercises, fix the TypeScript errors to be able to pass the criteria without passing the whole Student information.
Fix the errors that occur when assigning a type to criteria.
```
const students: Student[] = [
  {
    name: "Luke Patterson",
    age: 32,
    occupation: "Internal auditor",
  },
  {
    name: "Emily Coleman",
    age: 25,
    occupation: "English",
  },
  {
    name: "Alexandra Morton",
    age: 35,
    occupation: "Conservation worker",
  },
  {
    name: "Bruce Willis",
    age: 39,
    occupation: "Placement officer",
  },
];

const filterStudentsBy = (students: Student[], criteria: unknown): Student[] => {
  return students.filter((user) => {
    const criteriaKeys = Object.keys(criteria);
    return criteriaKeys.every((fieldName) => {
      return criteria[fieldName] === student[fieldName];
    });
  });
};

const logStudent = ({ name, occupation }: Student) => {
  console.log(`  - ${name}, ${occupation}`);
};

console.log("Students of age 35:");
filterStudentsBy(students, { age: 35 }).forEach(logStudent);
```

Solution using Partial Type
```
interface Person {
  name: string;
  age: number;
}

interface Student extends Person{
  occupation: string;
}
  
const students: Student[] = [
  {
    name: "Luke Patterson",
    age: 32,
    occupation: "Internal auditor",
  },
  {
    name: "Emily Coleman",
    age: 25,
    occupation: "English",
  },
  {
    name: "Alexandra Morton",
    age: 35,
    occupation: "Conservation worker",
  },
  {
    name: "Bruce Willis",
    age: 39,
    occupation: "Placement officer",
  },
];

const filterStudentsBy = (students: Student[], criteria: Partial<Student>): Student[] => {
  return students.filter((user) => {
    const criteriaKeys = Object.keys(criteria);  // criteriaKeys = [ 'age' ]
    return criteriaKeys.every((fieldName) => {   // fieldname = age
      return criteria[fieldName] === user[fieldName];
    });
  });
};

const logStudent = ({ name, occupation }: Student) => {
  console.log(`  - ${name}, ${occupation}`);
};

console.log("Students of age 35:");
filterStudentsBy(students, { age: 35 }).forEach(logStudent);

```
Result output:
```
Students of age 35:
  - Alexandra Morton, Conservation worker
```


## Exercise 5
Using generics and tuples, fix the compilation errors from the following function:

```
const swap = (arg1, arg2) => {
  return [arg2, arg1];
};

let age: number, occupation: string;

[occupation, age] = swap(39, "Placement officer");
console.log("Occupation: ", occupation);
console.log("Age: ", age);
```
Solution
```
const swap = <T, U>(arg1: T, arg2: U): [U, T] => {
  return [arg2, arg1];
};

let age: number, occupation: string;

[occupation, age] = swap(39, "Placement officer");
console.log("Occupation: ", occupation);
console.log("Age: ", age);
```
Result output:
```
Occupation:  Placement officer
Age:  39
```