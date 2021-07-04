//Prefix : /author

//Initializing express router
const Router = require("express").Router();

//Database Models
const AuthorModel = require("../../database/author");




/*
router          /authors
description     getall authers
access          public
parameter       none
method          GET
*/
Router.get("/", async(req, res) => {
    const getAllAuthor = await AuthorModel.find();
    return res.json({ getAllAuthor });
});



/*
router          /author/id
description     to get specific author
access          public
parameter       author
method          GET
*/
Router.get("/id/:id", async(req, res) => {
    const getSpecificAuther = await AuthorModel.findOne({
        id: req.params.id
    });
    if (!getSpecificAuther) {
        return res.json({ error: `NO Auther found for this id of ${req.params.id}, try another one` })
    }
    return res.json({ getSpecificAuther });
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/new", async(req, res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = await AuthorModel.create(newAuthor);
    return res.json({ message: "auther was added" })
});


/*
router          /author/update
description    update author name
access          public
parameter       id
method          PUT
*/
Router.put("/update/:id", async(req, res) => {
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
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
Router.delete("/delete/:id", async(req, res) => {
    const deleteAuthor = await AuthorModel.deleteOne({
        id: req.params.id,
    })
    return res.json({ message: "deleted" });
});

module.exports = Router;