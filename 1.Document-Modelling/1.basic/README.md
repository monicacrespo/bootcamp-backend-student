# Basic - MongoDB data modelling exercise 

Generate a model that reflects the following requeriments:

1. Show the latest courses published.
2. Show the courses per category (devops / front End ...).
3. Show a course and its lectures.
4. For a lecture, show its author.


## Solution structure 

```
├── 1.basic
│   ├── elearningPortal.dmm (new)
│   ├── elearningPortalModel.JPG (new)
│   ├── README.md (new)
├── README.md
```
## MongoDB schema design in Moon Modeler 

This is the `Entity–relationship Diagram - ERD` in Moon Modeler (elearningPortal.dmm file).
![Elearning Portal Model](ELearningPortalModel.JPG)

MongoDB is a document based database. Each record in a collection is a document, and every document should be self-contained (it should contain all information that you need inside it).

Moon Modeler is a data modeling tool for both noSQL and relational databases. 

The file elearningPortal.dmm represents the model which has been implemented using Moon Modeler. 

`MongoDB collections` are used to store the data (represented in blue).

`MongoDB documents` are objects that can be embedded in collections or other documents (represented in gree). A document is only a data description, no collection is created.


## Reasoning and patterns used in the schema design
In the above e-portal application's model, these are the relationships I've identified:

### 1.A. Category (collection) - Course (collection)
   One-to-many: A category might have multiple courses entities.
   * I have used the `Embedded document pattern`. In the normalized data model, the courses collection contain a reference to the categories collection.

      ```
      // categories collection
      {
      _id: "1", 
      name: "Back End"
      }
      ```

      ```
      // courses collection
      {  
      _id: "786", 
      name: "The Complete Developers Guide to MongoDB",
      description: "Who this course is for: MongoDB Developers or data scientists who are working on it or wanted to learn it.",
      lastUpdated: ISODate ("2022-04-21"),
      category: {"_id": "1", name: "Back End"},
      lectures: [
         { "_id": "1", name: "Let's Start", publishedDate: ISODate ("2022-04-01") }, 
         ...
         { "_id": "10", name: "Core Fundamentals of MongoDB", publishedDate: ISODate ("2022-04-20")  ... },
         ...
      ]
      },
      {
      _id: "785", 
      name: "Complete NodeJS Developer in 2022 (GraphQL, MongoDB, + more)",
      description: "Learn from real NodeJS experts! Includes REALLY Advanced NodeJS, Express, GraphQL, REST, MongoDB, SQL, MERN + much more.",
      lastUpdated: ISODate ("2022-04-01"),
      category: {"_id": "1", name: "Back End"},
      lectures: [ { .. }, { .. }, ... ]  
      },
      ...
      {  
      _id: "781", 
      name: "Java Programming Masterclass covering Java 11 & Java 17",
      description: "Learn Java In This Course And Become a Computer Programmer. Obtain valuable Core Java Skills And Java Certification.",
      lastUpdated: ISODate ("2022-03-25"),
      category: {"_id": "1", name: "Back End"},
      lectures: [ { .. }, { .. }, ... ]
      },
      ...
      {  
      _id: "1", 
      name: "C# Basics for Beginners: Learn C# Fundamentals by Coding",
      description: "Master C# fundamentals in 6 hours - The most popular course with 50,000+ students, packed with tips and exercises.",
      lastUpdated: ISODate ("2022-01-21"),
      category: {"_id": "1", name: "Back End"},
      lectures: [ { .. }, { .. }, ... ]
      }
      ```
      Because the application frequently retrieves the courses data with the name (category) information, then it needs to issue multiple queries to resolve the references. 
      
      A more optimal schema would be to use the `Embedded document pattern` embedding the `courses` data in the `category` data to reduce the JOIN operation. With the embedded data model, this application can retrieve the complete category information with one query.
   
   * I also have used the `Extended ref pattern` to only access the course's data which is required by the application, in this model those fieds are `_id`, `name` and `lastUpdated` in `CoursesSimplified` document:

      ```
      \\ CategoriesSubset document
      {
         "_id": "1",
         "name": "Back End",
         "courses": [
         { "_id": 786, "name": "The Complete Developers Guide to MongoDB", lastUpdated: ISODate ("2022-04-21") },
         { "_id": 785, "name": "Complete NodeJS Developer in 2022 (GraphQL, MongoDB, + more)", lastUpdated: ISODate ("2022-04-01") },
         ...
         { "_id": 1, "name": "C# Basics for Beginners: Learn C# Fundamentals by Coding", lastUpdated: ISODate ("2022-01-21") }
         ]
      }
      ```

   * I also have used the `Subset pattern` to include only the category's five most recent courses, instead of storing all of the courses in the category. 

     The courses are sorted in reverse chronological order. When an user visits a category page, the application loads the five most recent courses.

     The `categories` collection stores information on each category, including the category's five most recent courses.
      ```
     {
         "_id": "1",
         "name": "Back End",
         "courses": [
         { "_id": 786, "name": "The Complete Developers Guide to MongoDB", lastUpdated: ISODate ("2022-04-21") },
         ...
         { "_id": 781, "name": "Java Programming Masterclass covering Java 11 & Java 17", lastUpdated: ISODate ("2022-03-25") }               
         ]
     }
     ```
### 1.B Course (collection) - Category (collection)
   One-to-one: One course belongs to only one category.
   
   The `courses` collection stores all courses. Each course contains a reference to the category for which it was written.

     ```
     {
         _id: "786",
         name: "The Complete Developers Guide to MongoDB",
         description: "Who this course is for: MongoDB Developers or data scientists who are working on it or wanted to learn it.", 
         category: {"_id": 1, "name: "Braulio Díez"},
         ...
     },
     {
         _id: "785",
         name: "Complete NodeJS Developer in 2022 (GraphQL, MongoDB, + more)",
         description: "Learn from real NodeJS experts! Includes REALLY Advanced NodeJS, Express, GraphQL, REST, MongoDB, SQL, MERN + much more.",
          category: {"_id": 2, "name: "Daniel Sánchez"},
         ...
     }
     ...
     {
         _id: "1",
         name: "C# Basics for Beginners: Learn C# Fundamentals by Coding",
         description: "Master C# fundamentals in 6 hours - The most popular course with 50,000+ students, packed with tips and exercises.", 
         category: {"_id": 3, "name: "Clara Ruiz"}, 
         ...
     }
     ```
### 2.A. Course (collection) - Lecture (document)
   One-to-many: A course might have multiple lecture documents.  
   * I've used the `Embedded document pattern` including the lectures for each course to reduce the JOIN operation. 
   * I've used the `Extended ref pattern` to only access the lecture's data which is required by the application, `LecturesSimplified` with only the id and lecture's name,  instead of all fields from `Lectures` embedded data.
   * I also have used the `Subset pattern` to include only the course's five most recent lectures, instead of storing all of the lectures in the course. 

     A potential problem with the embedded document pattern is that it can lead to large documents. In this case, you can use the subset pattern to only access data which is required by the application, instead of the entire set of embedded data.

     The `working set` is the data that your application is constantly requesting. If your “Working Set” all fits in RAM then all access will be fast as the operating system will not have to swap to and from disk as much. This way the working set is small and efficient. When an user visits a course page, the application loads the five most recent lectures very quick.
    
### 2.B. Lecture (document) - Course (collection)
   One-to-one: One lecture belongs to only one course. 
   Each lecture contains a reference to the course for which it was written.
   * I've used the `Extended ref pattern`. Embedding all of the information about a course for each lecture just to reduce the JOIN operation results in a lot of duplicated information. Additionally, not all of the course information may be needed for a lecture. I only embed the `nameCourse` because in `courses` collection the `name` is an unique constraint to allow only a single document with the same value for the indexed key. 

   Lectures document
   ```
   {
      _id: 10,
      name: "Core Fundamentals of MongoDB",
      video: objectId("111f1f17bcf86cf123456789"),
      article: objectId("222f1f17bcf86cf123456789"),   
      publishedDate: ISODate ("2022-04-20"),
      nameAuthor: "Braulio Díez",
      nameCourse: "The Complete Developers Guide to MongoDB"
   }
   ```
### 3.A. Category (collection) - Lecture (document)
   One-to-many: A category might have multiple lectures documents. This is done through courses.

### 3.B. Lecture (document) - Category (collection)
   One-to-one: One lecture belongs to only one category.
   Each lecture contains a reference to the category for which it was classified.

### 4.A. Author (collection) - Lecture (document)
   One-to-many: An author might have multiple lectures documents. 

### 4.B. Lecture (document) - Author (collection)
   One-to-one: One lecture is created by one author. 
   Each lecture contains a reference to the author who created it. 

   * I've used the `Extended ref pattern`. In this e-portal application, the idea of an author exists, as does a lecture. They are separate logical entities.

      Lectures document
      ```
      {
         _id: 10,  
         name: "Core Fundamentals of MongoDB"
         video: objectId("111f1f17bcf86cf123456789"),
         article: objectId("222f1f17bcf86cf123456789"),  
         publishedDate: ISODate ("2022-04-20")
      }
      ```

      Authors collection
      ```
      {
         _id: 1,
         name: "Braulio Díez",
         bio: "Desarrollador, ponente, formador y escritor, más de 15 años de experiencia en proyectos internacionales, apasionado del open source"
      }
      ```

      From a performance standpoint, however, this becomes problematic as we need to put the pieces of information together for a specific lecture. One author can have N lectures, creating a 1-N relationship. From an lecture standpoint, if we flip that around, they have an N-1 relationship with an author. Embedding all of the information about an author for each lecture just to reduce the JOIN operation results in a lot of duplicated information. Additionally, not all of the author information may be needed for a lecture.


      The Extended Reference pattern provides a great way to handle these situations. Instead of duplicating all of the information on the author, I only copy the fields we access frequently. Instead of embedding all of the information or including a reference to JOIN the information, I only embed those fields of the highest priority and most frequently accessed, such as `nameAuthor`. In `authors` collection the `name` is an unique constraint to allow only a single document with the same value for the indexed key. 

      Lectures document
      ```
      {
         _id: 10,  
         name: "Core Fundamentals of MongoDB",
         video: objectId("111f1f17bcf86cf123456789"),
         article: objectId("222f1f17bcf86cf123456789"),   
         publishedDate: ISODate ("2022-04-20"),   
         nameAuthor: "Braulio Díez"
      }
      ```

### 5.A. Course (collection) - Author (collection)
   One-to-many: A course might be created by more than one author. The course web page only shows the link of its authors.
  
   * I've used the `Embedded document pattern` including the authors for each course to reduce the JOIN operation. 
   * I've used the `Extended ref pattern` to only access the author's data which is required by the application, `AuthorsSimplified` with only the id and author's name, instead of all fields from `Authors` embedded data. Besides, the `bio` field might take a lot of space.
   

   Regarding the authors, we have got them per lecture and we also duplicated within course to simplified the queries.

### 5.B. Author (collection) - Course (collection)
   One-to-many: An author might create more than one course. 
   

## E-portal application's model collections and document's examples

Note that for easier understanding, in the examples I am representing the _id as a number, instead of a GUID.

```
// Categories collection
{
   _id: "1",
   name: "Back End"
}
```
```
// CategoriesSimplified document
{
   _id: "1",
   name: "Back End"
}
```
```
// CategoriesSubset document
{
   _id: "1",
   name: "Back End",
   courses: [
    {"_id": 786, "name": "The Complete Developers Guide to MongoDB", "lastUpdated": ISODate ("2022-04-21")},
    ...
   ]
}
```

```
// Authors collection
{
    _id: 1,
   name: "Braulio Díez",
   bio: "Desarrollador, ponente, formador y escritor, más de 15 años de experiencia en proyectos internacionales, apasionado del open source"
}
```

```
// AuthorsSimplified document
{
    _id: 1,
   name: "Braulio Díez"
}
```

```
// Lectures document
{
   _id: 10,  
   name: "Core Fundamentals of MongoDB",
   video: objectId("111f1f17bcf86cf123456789"),
   article: objectId("222f1f17bcf86cf123456789"),  
   publishedDate: ISODate ("2022-04-20"),
   categoryId: "1", 
   nameAuthor: "Braulio Díez",
   nameCourse: "The Complete Developers Guide to MongoDB"
}
```

```
// LecturesSimplified document
{
   _id: 10, 
   name: "Core Fundamentals of MongoDB",
   publishedDate: ISODate ("2022-04-20")
}
```

```
// CoursesSimplified document
{
   _id: "786",
   name: "The Complete Developers Guide to MongoDB",  
   lastUpdated: ISODate ("2022-04-21")
}
```

```   
// Courses collection
{  
   _id: "786", 
   name: "The Complete Developers Guide to MongoDB",
   description: "Who this course is for: MongoDB Developers or data scientists who are working on it or wanted to learn it.",
   lastUpdated: ISODate ("2022-04-21"),
   category: {"_id": "1", name: "Back End"}, 
   lecture: [
    { "_id": "1", name: "Let's Start", publishedDate: ISODate ("2022-04-01") }, 
    ...
    { "_id": "10", name: "Core Fundamentals of MongoDB", publishedDate: ISODate ("2022-04-20") },
    ...
   ],
   author: [
    { "_id": "1", name: "Braulio Díez" }, 
    { "_id": "2", name: "Daniel Sánchez" },
    ...
   ]
}
```
