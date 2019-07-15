  
  'use strict';

  $(document).ready(function(){
    
    // Firebase database
    let config = {
      apiKey: "AIzaSyBzvvSTdq17EAnncHWZ6YpHTykWWUs_Qvs",
      authDomain: "book-finder-6cc03.firebaseapp.com",
      databaseURL: "https://book-finder-6cc03.firebaseio.com",
      projectId: "book-finder-6cc03",
      storageBucket: "",
      messagingSenderId: "893603769974"
    };
    firebase.initializeApp(config);
    let database = firebase.database();
    // console.log('test');

    // $("#submit").on("click", function() {
    // window.addEventListener('load', () => {
    // window.onload = function() {
    // $("#submit").on("click", function(event) {
      event.preventDefault();
      console.log('display ready!');
      database.ref().on('value', function(snapshot) {
        if (!snapshot.val()) {
          console.log('No books are in the database');
          return false;
        }

        //Grabs form data
        let keys = Object.keys(snapshot.val());
        let last = keys.pop();
        let data = snapshot.child(last).val();
        let target = data.target;
        let suggestion = data.suggestion;
        let search = data.search;

        //Separates all firebase objects, then adds them to a list of books
        if (keys.length == 0) {
          console.log('No books are in the database');
          return false;
        }
        let books = [];
        keys.unshift();
        keys.forEach(function(key) {
          let temp = snapshot.child(key).val();
          let book = {
            title: temp.title,
            author: temp.author,
            genre: temp.genre,
            age: temp.age,
            description: temp.description
          }
          books.push(book);
        })
        
        //Checks if a request is made
        if (!search) return false;
        if(target != false && suggestion != false) {
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
        if (relevant.length == 0) {
          console.log('No matching books were found');
          return false;
        }
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
            console.log(book.title);
            book.title = format(book.title);
            console.log(book.title);
            book.author = format(book.author);
        });
        function format(str) {
            let result = "";
            for (let word of str.split(' ')) {
              result = result.concat(" ");
              let temp = word.substring(0,1).toUpperCase();
              temp = temp.concat(word.substring(1).toLowerCase());
              result = result.concat(temp);
            }
            return result.substring(1);
        }

        console.log(relevant[0].title);

    //Export the book
    // app.get('../../pages/display', function(req, res) {
    //   let allMatches = [];
    //   relevant.forEach(function(book) {
    //     let elem = new Object();
    //     elem.title = book.title;
    //     elem.author = book.author;
    //     elem.genre = book.genre;

    //     allMatches.push(elem);
    //     console.log(elem)
    //   });
    //   res.render('../../pages/display.html', {allMatches:allMatches})
    // });


    });

    return false;

  });

// });