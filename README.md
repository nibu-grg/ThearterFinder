# THEATER TRACKER

# Introduction #

The TheaterTracker is a comprehensive theater management system that was designed to enhance user access to theater details and the access to theater information is provide by administrators. This web application, with an intuitive user interface for both administrators and users, ensures efficient processing of theater data. The primary goal of TheaterTracker is to provide a structured platform where managing theaters is made simpler, and finding theaters in desired locations becomes easier for users.

# Project Overview #

Theater tracker is a web based application. This system allows andministrator to manage theater details.

## Key Features ##
### Admin Functionalities ###
-**Create:** Using this admin can add new theater by providing basic details including name, location, city, eircode, contact number, and email. Each theater is assigned with a unique id while creation.

  - Admin can interact with the form data there he/she can add theater details.
  - When form is submitted the JavaScript handleAddForm() function is called.
  - handleAddForm() is responsible for take the form data and make it ready for submission.
  - Then it will make a POST request to the backend API endpoint to add add a new record.
  - The backend server will handle the incoming POST request /addTheater endpoint.
  - Then after processing the request and sends the response back to the UI.
      

-**Read:** It will help to get a diverse list of all theaters along with their details

  - When the page is loaded the TheaterList() function got triggered
  - It make a GET request take all data from backend.
  - The backend process the GET request at the /theaters endpoint
  - It queries the database and fetch all data then send them back to frontend

-**Update:** Alter the theater's current details as needed.

  - When admin clicks the edit button that associated with a record.
  - The updateTheater() function is trigged, which pre-fills a form with corresponding data.
  - After editing, the admin submit the form, that call PUT request to update the data.
  - The backend recives the PUT request /updateTheater/:Theater_Id endpoint.
  - Then the server updates the specfic record with the new data.

-**Delete:** Theaters that are no longer in use then admin can remove it.

  - If admin clicks the delete button associated with a specific record.
  - The deleteTheater() function is called, which triggers DELETE request to remove data from the backend.
  - The server process the DELETE request at /deleteTheater/:Theater_Id endpoint.
  - Then the record removed from the database and then the server send a confirmation response.

## Technologies Used ##
This system uses modern technologies to ensure the web application is smooth and effective. The main technolofies used in this project are:

### Front End ###
-**HTML:** This is the main part of the web application, utilized the development of the web page's content and structure.

-**CSS:** It is used to improve the application's visual attractiveness through layout, font, and color styling.

-**JavaScript:** Purpose of this is to make the interface more dynamic and interactive. 

### Back End ###
-**Node.js:** Node.js is a event-driven runtime environment that allows JavaScript to be used on the server side. It is mainly used to handle asynchronous tasks efficiently.

### Database ###
-**MySQL:** It is an open source relational database management system(RDBMS) that's used to store and manage data. 

## Conclusion ##

The Theater Management System makes data handling easier and quicker. The system simplifies data management procedures for the administrator by embedding all the major administrative features: create, read, update, and remove theatrical metadata. With an outstanding tech stack-HTML, CSS, JavaScript, MySQL, and Node.js, this application assures scalability, reliability, and ease for end-users.

This project, emphasizing real-life needs for data organization, user interaction, and maintenance of the system, shows the practical application of concepts from web development and database administration.

The conclusion is that the Theater Management System is a good starting point for new improvements, such as adding some user-oriented functionality like theatre search and advanced filtering. It is a helpful tool within the context of theater management because it illustrates the prospect of continued evolution toward meeting the growing demands of consumers.

## References ##
-**CRUD REST API with Node.js, Express.js, and PostgreSQL - DEV Community: https://dev.to/justahmed99/crud-rest-api-with-nodejs-expressjs-and-postgresql-57b2 [Accessed 09 November 2024]**

-**Testing NodeJs/Express API with Jest and Supertest - DEV Community: https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6 [Accessed 23 November 2024]**

-**Troubleshooting · Jest: https://jestjs.io/docs/troubleshooting [Accessed 26 November 2024]**






