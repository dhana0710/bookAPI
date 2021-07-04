//Prefix : /book

//Initializing express router
const Router = require("express").Router();

//Database Models
const BookModel = require("../../database/book");



/*
router          /
description     to get all book
access          public
parameter       non
method          GET
 */
Router.get("/", async(req, res) => {
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
Router.get("/is/:isbm", async(req, res) => {
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
Router.get("/c/:category", async(req, res) => {
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
router          /book/new
description    to get new author
access          public
parameter       non
method          POST
*/

Router.post("/new", async(req, res) => {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({ message: "book was added" })
});


/*
router          /book/update
description    update book detail
access          public
parameter       isbn
method          PUT
*/

Router.put("/update/:isbn", async(req, res) => {
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
Router.put("/author/update/:isbn", async(req, res) => {
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
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
Router.delete("/delete/:isbn", async(req, res) => {
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
Router.delete("/delete/author/:isbn/:authorId", async(req, res) => {
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
router          /a
description     get list of of  books based on a author ID
access          public
parameter       category
method          GET
 */
Router.get("/a/:author", async(req, res) => {
    const getSpecificAuther = await BookModel.find({ authors: req.params.author });
    //null

    if (!getSpecificAuther) {
        return res.json({ error: `NO book found for this auther ID of ${req.params.author}, try another one` })
    }
    return res.json({ getSpecificAuther });

});

module.exports = Router;