let books = [{
        ISBN: "1234ONE",
        title: " A TIME TO KILL ",
        authors: [1, 2],
        language: "en",
        pubDate: "2021-07-10",
        numOfPages: "301",
        category: ["horror", "fiction"],
        publication: 1,
    },
    {
        ISBN: "1234THREE",
        title: " G.I.JOE ",
        authors: [1],
        language: "en",
        pubDate: "2021-07-30",
        numOfPages: "311",
        category: ["horror", "action", "advancher"],
        publication: 1,
    },
];

//authors
let authors = [{
            id: 1,
            name: "dhana",
            book: ["1234ONE", "1234TWO"]
        }, {
            id: 2,
            name: "dhana",
            book: ["1234NINE"]
        },
        {
            id: 3,
            name: "ram",
            book: ["1234ONE"]
        },
    ]
    //publications
let publications = [{
    id: 1,
    name: "Delta",
    books: ["1234ONE", "1234NINE"]
}, {
    id: 2,
    name: "R.M.K",
    books: ["1234TWO"]
}];


//sending file
module.exports = { books, authors, publications };