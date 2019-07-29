const axios = require('axios');
const cheerio = require('cheerio');

var fb = require("firebase");
let config = {
    apiKey: "AIzaSyBzvvSTdq17EAnncHWZ6YpHTykWWUs_Qvs",
    authDomain: "book-finder-6cc03.firebaseapp.com",
    databaseURL: "https://book-finder-6cc03.firebaseio.com",
    projectId: "book-finder-6cc03",
    storageBucket: "",
    messagingSenderId: "893603769974"
  };
fb.initializeApp(config);
let database = fb.database();

// Check if empty
database.ref().once('value', function(snapshot) {
    if (!snapshot.val() || (snapshot.numChildren() == 1) && snapshot.hasChild("form data")) {
        console.log('running');
        run();
    }
    else {
        console.log('Children: ' + snapshot.numChildren());
        process.exit();
    }
});

let books = [];
let titles = [];

let scrapeGuardian = new Promise(resolve => {
    let num = 1;
    let url = 'https://www.theguardian.com/books/2015/aug/17/the-100-best-novels-written-in-english-the-full-list';

    axios.get(url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const text = $.text();
        let rest = text;

        while (num <= 100) {
            rest = rest.substring(rest.indexOf(num + '.'));
            let head = rest.substring(rest.indexOf(" ")+1, rest.indexOf("(")-1).split(" by ");
            let title = head[0];
            let author = head[1];
            rest = rest.substring(rest.indexOf("\n")+1);
            let description = rest.substring(0, rest.indexOf("\n"));

            let book = {
                title: title.toLowerCase(),
                author: author.toLowerCase(),
                description: [],
            }
            book.description.push({review: description, source: 'The Guardian'});

            addBook(book);
            num++;
        }
    });

    setTimeout(function() {
        if (num == 101) {
            resolve();
        }
    }, 2000);
});

function addBook(book) {
    if (titles.includes(book.title)) {
        for (let i = 0; i < books.length; i++) {
            if (books[i].title == book.title) {
                book[i].description.push(book.description);
                break;
            }
        }
    }
    else {
        titles.push(book.title);
        books.push(book);
    }
}

function run() {
    scrapeGuardian.then(() => {
        console.log(books.length);
        books.forEach(book => database.ref().push(book));
        setTimeout(function() {
            process.exit();
        }, 3000);
    });
}