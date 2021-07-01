const mongoose = require("mongoose");


//creating a book schema
const AuthorSchema = mongoose.Schema({

    id: Number,
    name: String,
    book: [String],

});
//create a book model

const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorModel;