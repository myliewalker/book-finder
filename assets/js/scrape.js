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
    // if (!snapshot.val() || (snapshot.numChildren() == 1) && snapshot.hasChild("form data")) {
    //     console.log('running');
    //     run();
    // }
    // else {
    //     process.exit();
    // }
    run();
});

let books = [];
let titles = [];

let guardian = new Promise(resolve => {
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
                title: formatStr(title),
                author: formatStr(author),
                description: []
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

let amazon = new Promise(resolve => {
    let num = 1;
    let url = 'http://www.harvard.com/shelves/top100/?source=post_page---------------------------';

    axios.get(url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const text = $.text();
        let rest = text;

        console.log(html);
        process.exit();
    });

    setTimeout(function() {
        if (num == 101) {
            resolve();
        }
    }, 2000);
});

// let time = new Promise(resolve => {
//     let url = 'http://entertainment.time.com/2005/10/16/all-time-100-novels/slide/the-adventures-of-augie-march-1953-by-saul-bellow/';
//     axios.get(url).then(response => {

//         const html = response.data;
//         const $ = cheerio.load(response.data);
//         let links = [];
//         links.forEach(link => {
//             axios.get(url).then(response => {
//                 const $ = cheerio.load(response.data);
//                 let head = $('title').text();
//                 let title = head.substring(0, head.indexOf("(")-1);
//                 let author = head.substring(head.indexOf("by")+3, head.indexOf("|")-1);

//                 let book = {
//                     title: formatStr(title),
//                     author: formatStr(author),
//                     description: []
//                 }
//                 book.description.push({review: description, source: 'Time Magazine'});

//                 addBook(book);
//             });
//         });

//         console.log($.text());
//         process.exit();
//     })
// })

// Format book
function formatStr(str) {
    let result = "";
    for (let word of str.split(' ')) {
        if (word.contains("-")) {
            result = result.concat(" ")
            for (let part of word.split("-")) {
                let temp = part.substring(0, 1).toUpperCase();
                temp = temp.concat(part.substring(1).toLowerCase());
                result = result.concat(temp);
            }
        }
        else {
            result = result.concat(" ");
            let temp = word.substring(0,1).toUpperCase();
            temp = temp.concat(word.substring(1).toLowerCase());
            result = result.concat(temp);
        }
    }
    return result.substring(1);
}

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
    // let gcomplete = false;
    // guardian.then(() => {
    //     gcomplete = true;
    // });
    let acomplete = false;
    amazon.then(() => {
        acomplete = true;
        setTimeout(function() {
            process.exit();
        }, 3000);
    });
    // if (gcomplete) {
    //     books.forEach(book => database.ref().push(book));
    // }
    // setTimeout(function() {
    //     process.exit();
    // }, 3000);
}