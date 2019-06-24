//get values from firebase and store it into books
let newBook = function () {
    let tBook = require("app.js");
    console.log(tBook);
    return tBook;
}
books.push(newBook);

let entry;

//determine which books match
let correctGenre = books.filter(book => 
    book.genre.some(g => function() {
        for (let gen of entry.genre) {
            if (g == gen) return true;
        }
        return false;
    }));
let relevant = correntGenre.filter(book => 
    book.age == entry.age);

//sort the matching books
relevant.sort(function(a, b) {
    if (a.author > b.author) return 1;
    if (a.author < b.author) return -1;
    if (a.title > b.title) return 1; 
    return -1;
})

alert(relevant.toString);