  
  'use strict';

  $(document).ready(function(){
    
    //Firebase database
    let database = firebase.database();
    $("#submit").on("click", function() {
        let books = database.data;

        let target = require('./app').target;
        let suggestion = require('./app').suggestion;
        
        //Checks if a request is made
        if (!target) return false;
        if(target && suggestion) {
            books.pop();
        }

        //Filters by genre
        let correctGenre = books.filter(book => function () {
            book.genre.some(g => function() {
                if (g == target.genre) return true;
                return false;
            })
          });
        //Filters by age
        let relevant = correctGenre.filter(book => book.age == target.age);

        //Sorts the matching books by author
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

        //Formats appearance
        relevant.forEach(function(book) {
            book.title = format(title);
            book.author = format(author);
        });
        function format(str) {
            let result = '';
            for (let word of str.split(' ')) {
                let temp = `${word.substring(0,1).toUpperCase()} ${word.substring(1)}`;
                result.concat(temp);
            }
            return result;
        }

    //Export the book
    app.get('../../pages/display', function(req, res) {
      let allMatches = [];
      relevant.forEach(function(book) {
        let elem = new Object();
        elem.title = book.title;
        elem.author = book.author;
        elem.genre = book.genre;

        allMatches.push(elem);
        console.log(elem)
      });
      res.render('../../pages/display.html', {allMatches:allMatches})
    });

  });

});