//Prefix : /publication

//Initializing express router
const Router = require("express").Router();

//Database Models
const PublicationModel = require("../../database/publication");


/*
router          /publications
description     get all publications
access          public
parameter       none
method          GET
*/
Router.get("/", (req, res) => {
    return res.json({ publications: database.publications });
});

/*
router          /publication/:isbn
description    to get a list of publications based on a book.
access          public
parameter       isbm
method          GET
*/
Router.get("/:isbm", async(req, res) => {
    const getSpecificPublication = await PublicationModel.find({ books: req.params.isbm })
    if (!getSpecificPublication) {
        return res.json({ error: `NO Publication found for this BOOK of ${req.params.isbm}, try another one` })
    }
    return res.json({ getSpecificPublication })
});


/*
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/new", (req, res) => {
    const { newPublication } = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json({ message: "publication was added" })

});




/*
router          /publication/update
description    update publication detail
access          public
parameter       id
method          PUT
*/
Router.put("/update/:id", async(req, res) => {
    const updatePublication = await PublicationModel.findOneAndUpdate({
        id: parseInt(req.params.id),
    }, {
        name: req.body.publicationName,
    }, {
        new: true,
    });

    return res.json({ publication: updatePublication, message: "update publication detail(name)" });


});
/*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

Router.put("/update/book/:isbn", async(req, res) => {
    //update the publication database
    const updatePublication = await PublicationModel.findOneAndUpdate({
        id: req.body.pubId,
    }, {
        $addToSet: {
            books: req.params.isbn,
        }
    }, {
        new: true,
    });
    // update the book database
    const updateBook = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn,
    }, {
        publication: req.body.pubId,
    }, {
        new: true,
    });

    return res.json({
        books: updateBook,
        publications: updatePublication,
        message: "Successfully updated publication",
    });
});

/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async(req, res) => {
    // update the publication database
    const deleteBookpublication = await PublicationModel.findOneAndUpdate({
        id: parseInt(req.params.pubId)
    }, {
        $pull: {
            books: req.params.isbn,
        }
    }, {
        new: true,
    });
    //update the book database
    const deleteBookPublication = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn
    }, {
        publication: 0
    }, {
        new: true,
    });
    return res.json({ message: "Done" });
});



/*
Route           /publication/delete
Description     delete a author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
Router.delete("/delete/:id", async(req, res) => {
    const publicationBook = await PublicationModel.deleteOne({
        id: req.params.id,
    })
    return res.json({ message: "deleted" });
});

module.exports = Router;