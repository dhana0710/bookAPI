require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//set database
const database = require("./database/index.js");

const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

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

/*
router          /
description     to get all book
access          public
parameter       non
method          GET
 */
bookie.get("/", async(req, res) => {
    const getAllBooks = await BookModel.find();
    //console.log(getAllBooks);    
    return res.json({ getAllBooks });
});
/*
router          /is
description     to get Particular book
access          public
parameter       isbm
method          GET
 */
bookie.get("/is/:isbm", async(req, res) => {
    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbm });
    //null

    if (!getSpecificBook) {
        return res.json({ error: `NO book found for this ISBM of ${req.params.isbm}` })
    }
    return res.json({ book: getSpecificBook });
});
/*
router          /category or /c
description     get list of books based on a category
access          public
parameter       category
method          GET
 */
bookie.get("/c/:category", async(req, res) => {
    const getSpecificCategory = await BookModel.find({ category: req.params.category })
    if (!getSpecificCategory) {
        return res.json({ error: `NO book found for this category of ${req.params.category}, try another one` })
    }
    return res.json({ Catergory: getSpecificCategory });
    //const getSpecificBook = database.books.filter((book) => book.category.includes(req.params.category));
    //if (getSpecificBook.length == 0) {
    //    return res.json({ error: `NO book found for this category of ${req.params.category}, try another one` })
    //}
    //return res.json({ book: getSpecificBook });
});
/*
router          /a
description     get list of of  books based on a author ID
access          public
parameter       category
method          GET
 */
bookie.get("/a/:author", async(req, res) => {
    const getSpecificAuther = await BookModel.find({ authors: req.params.author });
    //null

    if (!getSpecificAuther) {
        return res.json({ error: `NO book found for this auther ID of ${req.params.author}, try another one` })
    }
    return res.json({ getSpecificAuther });

});
/*
router          /authors
description     getall authers
access          public
parameter       none
method          GET
*/
bookie.get("/authors", (req, res) => {
    const getAllAuther = AuthorModel.find();
    return res.json({ getAllAuther });
});
/*
router          /author/id
description     to get specific author
access          public
parameter       author
method          GET
*/
bookie.get("/author/id/:id", async(req, res) => {
    const getSpecificAuther = await AuthorModel.findOne({
        id: req.params.id
    });
    if (!getSpecificAuther) {
        return res.json({ error: `NO Auther found for this id of ${req.params.id}, try another one` })
    }
    return res.json({ getSpecificAuther });
});
/*
router          /author
description     to get a list of authors based on a book id
access          public
parameter       isbm
method          GET
*/
bookie.get("/author/:isbm", async(req, res) => {
    const getSpecificAuther = await AuthorModel.find({ book: req.params.isbm })
    if (!getSpecificAuther) {
        return res.json({ error: `NO Auther found for this Book of ${req.params.isbm}, try another one` })
    }
    return res.json({ getSpecificAuther });
});
/*
router          /publications
description     get all publications
access          public
parameter       none
method          GET
*/
bookie.get("/publications", (req, res) => {
    return res.json({ publications: database.publications });
});

/*
router          /publication
description    to get a list of publications based on a book.
access          public
parameter       isbm
method          GET
*/
bookie.get("/publication/:isbm", async(req, res) => {
    const getSpecificPublication = await PublicationModel.find({ books: req.params.isbm })
    if (!getSpecificPublication) {
        return res.json({ error: `NO Publication found for this BOOK of ${req.params.isbm}, try another one` })
    }
    return res.json({ getSpecificPublication })
});
/*
router          /book/new
description    to get new author
access          public
parameter       non
method          POST
*/

bookie.post("/book/new", async(req, res) => {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({ message: "book was added" })
});
/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
bookie.post("/author/new", async(req, res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({ message: "auther was added" })
});
/*
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
bookie.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json({ message: "publication was added" })

});
/***************************************************************************************/
/*
router          /book/update
description    update book detail
access          public
parameter       isbn
method          PUT
*/

bookie.put("/book/update/:isbn", async(req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn,
    }, {
        title: req.body.bookTitle,
    }, {
        new: true,
    });
    return res.json({ books: updatedBook });
});

/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
bookie.put("/book/author/update/:isbn", async(req, res) => {
    //update the book database
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn,
    }, {
        $addToSet: {
            authors: req.body.newAuthor,
        },
    }, {
        new: true,
    });
    //update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: req.body.newAuthor,
    }, {
        $addToSet: {
            book: req.params.isbn,
        }
    }, {
        new: true,
    });

    return res.json({ books: updatedBook, authors: updatedAuthor, message: "done" })
});
/*
router          /author/update
description    update author name
access          public
parameter       id
method          PUT
*/
bookie.put("/author/update/:id", async(req, res) => {
    const updateAuthor = await AuthorModel.findOneAndUpdate({
        id: parseInt(req.params.id),
    }, {
        name: req.body.authorName,
    }, {
        new: true,
    });

    return res.json({ authors: updateAuthor, message: "update author detail(name)" });
});
/*
router          /publication/update
description    update publication detail
access          public
parameter       id
method          PUT
*/
bookie.put("/publication/update/:id", async(req, res) => {
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

bookie.put("/publication/update/book/:isbn", async(req, res) => {
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
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
bookie.delete("/book/delete/:isbn", async(req, res) => {
    const deleteBook = await BookModel.deleteOne({
        ISBN: req.params.isbn,
    })
    return res.json({ message: "deleted" });
});
/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameters      isbn, author id
Method          DELETE
*/
bookie.delete("/book/delete/author/:isbn/:authorId", async(req, res) => {
    //update the book database
    const deleteAuthor = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn
    }, {
        $pull: {
            authors: parseInt(req.params.authorId),
        }
    }, {
        new: true,
    });

    // update the author database
    const deleteAutherBook = await AuthorModel.findOneAndUpdate({
        id: parseInt(req.params.authorId)
    }, {
        $pull: {
            book: req.params.isbn,
        }
    }, {
        new: true,
    });

    return res.json({
        message: "author was deleted!!!!!!😪",
        //book: deleteAuthor,
        //author: deleteAutherBook,
    });


});
/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
bookie.delete("/publication/delete/book/:isbn/:pubId", async(req, res) => {
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
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
bookie.delete("/author/delete/:id", (req, res) => {
    const deleteAuthor = await AuthorModel.deleteOne({
        id: req.params.id,
    })
    return res.json({ message: "deleted" });
});
/*
Route           /publication/delete
Description     delete a author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
bookie.delete("/publication/delete/:id", (req, res) => {
    const publicationBook = await PublicationModel.deleteOne({
        id: req.params.id,
    })
    return res.json({ message: "deleted" });
});



bookie.listen(3000, () => console.log("Server Running"));