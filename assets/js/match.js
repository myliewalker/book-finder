$(document).ready(function(){
    
    let database = firebase.database();
    
    $("#submit").on("click", function() {
        let books = database.data;
        let target = require('./app').target;
        let suggestion = require('./app').suggestion;
        
        if (!target && suggestion) return false;
        if(target && suggestion) {
            books.pop();
        }

        //Check that genres match
        let correctGenre = books.filter(book => 
            book.genre.some(g => function() {
                if (g == target.genre) return true;
                return false;
            }));
        //Check that age matches
        let relevant = correctGenre.filter(book => book.age == target.age);

        //Sort the matching books by author last name
        relevant.sort(function(a, b) {
            let res = compare(a.author.last, b.author.last);
            if (res != 0) return res;
            res = compare(a.author.first, a.author.last);
            if (res != 0) return res;
            return compare(a.title, b.title);
        })
        function compare(a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            if (a == b) return 0;
        }

    alert(relevant.toString);
    });

});