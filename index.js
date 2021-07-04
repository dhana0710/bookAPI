require("dotenv").config();

//Frame Work
const express = require("express");
const mongoose = require("mongoose");

//set database
//const database = require("./database/index.js");

//const BookModel = require("./database/book");
//const AuthorModel = require("./database/author");
//const PublicationModel = require("./database/publication");


//Microserices Router
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");


//intialization
const bookie = express();

//configuration 
bookie.use(express.json());

//establish DB connection

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("connection establish!"));

//Initializing micro-services
bookie.use("/book", Books);
bookie.use("/author", Authors);
bookie.use("/publication", Publications);


bookie.listen(3000, () => console.log("Server Running"));