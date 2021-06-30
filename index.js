require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//set database
const database = require("./database/index.js");

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
bookie.get("/", (req, res) => {
    return res.json({ books: database.books });
});
/*
router          /is
description     to get Particular book
access          public
parameter       isbm
method          GET
 */
bookie.get("/is/:isbm", (req, res) => {
        const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbm);
        if (getSpecificBook.length == 0) {
            return res.json({ error: `NO book found for this ISBM of ${req.params.isbm}` })
        }
        return res.json({ book: getSpecificBook });
    })
    /*
    router          /category or /c
    description     get specific books based on a category
    access          public
    parameter       category
    method          GET
     */
bookie.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.category.includes(req.params.category));
    if (getSpecificBook.length == 0) {
        return res.json({ error: `NO book found for this category of ${req.params.category}, try another one` })
    }
    return res.json({ book: getSpecificBook });
});
/*
router          /a
description     get specific books based on a author ID
access          public
parameter       category
method          GET
 */
bookie.get("/a/:author", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.authors.includes(parseInt(req.params.author)));
    if (getSpecificBook.length == 0) {
        return res.json({ error: `NO book found for this auther ID of ${req.params.author}, try another one` })
    }
    return res.json({ book: getSpecificBook });
});
/*
router          /authors
description     getall authers
access          public
parameter       none
method          GET
*/
bookie.get("/authors", (req, res) => {
    return res.json({ authors: database.authors });
});
/*
router          /author/id
description     to get specific author
access          public
parameter       author
method          GET
*/
bookie.get("/author/id/:id", (req, res) => {
    const getSpecificAuther = database.authors.filter((author) => author.id === parseInt(req.params.id));
    if (getSpecificAuther.length == 0) {
        return res.json({ error: `NO Auther found for this id of ${req.params.id}, try another one` })
    }
    return res.json({ author: getSpecificAuther })

});
/*
router          /author
description     to get a list of authors based on a book id
access          public
parameter       isbm
method          GET
*/
bookie.get("/author/:isbm", (req, res) => {
    const getSpecificAuther = database.authors.filter((author) => author.book.includes(req.params.isbm));
    if (getSpecificAuther.length == 0) {
        return res.json({ error: `NO Auther found for this BOOK of ${req.params.id}, try another one` })
    }
    return res.json({ author: getSpecificAuther })

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
bookie.get("/publication/:isbm", (req, res) => {
    const getSpecificPublication = database.publications.filter((pub) => pub.books.includes(req.params.isbm));
    if (getSpecificPublication.length == 0) {
        return res.json({ error: `NO Publication found for this BOOK of ${req.params.isbm}, try another one` })
    }
    return res.json({ author: getSpecificPublication })

});
/*
router          /book/new
description    to get new author
access          public
parameter       non
method          POST
*/

bookie.post("/book/new", (req, res) => {
    const { newbook } = req.body;
    database.books.push(newbook);
    return res.json({ books: database.books, message: "book was added" })
});
/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
bookie.post("/author/new", (req, res) => {
    const { newauthor } = req.body;
    database.authors.push(newauthor);
    return res.json({ authors: database.authors, message: "auther was added" })
});
/*
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
bookie.post("/publication/new", (req, res) => {
    const { newpublication } = req.body;
    database.publications.push(newpublication);
    return res.json({ publications: database.publications, message: "publication was added" })
});
/*
router          /book/update
description    update book detail
access          public
parameter       isbn
method          PUT
*/
bookie.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });
    return res.json({ books: database.books });
});

/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
bookie.put("/book/author/update/:isbn", (req, res) => {
    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.authors.push(req.body.newAuthor);
        }
    });
    //update the author database
    database.authors.forEach((author) => {
        if (author.id === req.body.newAuthor) {
            return author.book.push(req.params.isbn);
        }
    })
    return res.json({ books: database.books, authors: database.authors, message: "done" })
});
/*
router          /author/update
description    update author detail
access          public
parameter       id
method          PUT
*/
bookie.put("/author/update/:id", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.id)) {
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({ authors: database.authors, message: "update author detail(name)" });
});
/*
router          /publication/update
description    update publication detail
access          public
parameter       id
method          PUT
*/
bookie.put("/publication/update/:id", (req, res) => {
    database.publications.forEach((pub) => {
        if (pub.id === parseInt(req.params.id)) {
            pub.name = req.body.publicationName;
            return;
        }
    });
    return res.json({ publication: database.publications, message: "update publication detail(name)" });
});
/*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

bookie.put("/publication/update/book/:isbn", (req, res) => {
    //update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books,
        publications: database.publications,
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
bookie.delete("/book/delete/:isbn", (req, res) => {
    const updateBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );
    database.books = updateBookDatabase;
    return res.json({ books: database.books })
});
/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameters      isbn, author id
Method          DELETE
*/
bookie.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }
    });
    // update the author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.book.filter(
                (book) => book !== req.params.isbn
            );

            author.books = newBooksList;
            return;
        }
    });

    return res.json({
        message: "author was deleted!!!!!!😪",
        book: database.books,
        author: database.authors,
    });


});
/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
bookie.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    // update publication database
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            const newBooksList = publication.books.filter(
                (book) => book !== req.params.isbn
            );

            publication.books = newBooksList;
            return;
        }
    });

    // update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = 0; // no publication available
            return;
        }
    });

    return res.json({
        books: database.books,
        publications: database.publications,
    });
});
/*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
bookie.delete("/author/delete/:id", (req, res) => {
    const updateAuthorDatabase = database.authors.filter(
        (author) => author.id !== parseInt(req.params.id)
    );
    database.authors = updateAuthorDatabase;
    return res.json({ authors: database.authors })
});
/*
Route           /publication/delete
Description     delete a author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
bookie.delete("/publication/delete/:id", (req, res) => {
    const updatePublicationDatabase = database.publications.filter(
        (publication) => publication.id !== parseInt(req.params.id)
    );
    database.publications = updatePublicationDatabase;
    return res.json({ publications: database.publications })
});



bookie.listen(3000, () => console.log("Server Running"));