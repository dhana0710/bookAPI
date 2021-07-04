const mongoose = require("mongoose");


//creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        maxLength: 10,
        minLength: 5
    },
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPages: String,
    category: [String],
    publication: Number,

});
//create a book model

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;