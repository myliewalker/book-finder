(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
},{}],2:[function(require,module,exports){
  
  'use strict';

  $(document).ready(function(){
    
    //Firebase database
    let database = firebase.database();
    $("#submit").on("click", function() {
        let books = database.data;
        let target = require('./app.js').target;
        let suggestion = require('./app.js').suggestion;
        
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
    module.exports = relevant;

    });

});
},{"./app.js":1}]},{},[2]);