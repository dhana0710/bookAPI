const mongoose = require("mongoose");


//creating a book schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],

});
//create a book model

const PublicationModel = mongoose.model("publication", PublicationSchema);

module.exports = PublicationModel;