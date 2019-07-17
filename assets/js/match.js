  
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

      event.preventDefault();
      console.log('display ready!');
      database.ref().on('value', function(snapshot) {
        if (!snapshot.val()) {
          console.log('No books are in the database');
          return false;
        }

        //Grabs form data and removes it from firebase
        let keys = Object.keys(snapshot.val());
        keys.pop();
        let data = snapshot.child('form data').val();
        console.log(data);
        let target = data.target;
        let suggestion = data.suggestion;
        let search = data.search;
        // database.ref().child('form data').remove();

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
        console.log(books);
        
        //Checks if a request is made
        if (!search) {
          console.log('Not a search');
          return false
        };
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
        console.log(correctGenre);
        //Filters by age
        let relevant = correctGenre.filter(book => book.age == target.age);
        console.log(relevant);

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
            book.title = formatStr(book.title);
            book.author = formatStr(book.author);
            book.description = formatArr(book.description);
        });
        function formatStr(str) {
            let result = "";
            for (let word of str.split(' ')) {
              result = result.concat(" ");
              let temp = word.substring(0,1).toUpperCase();
              temp = temp.concat(word.substring(1).toLowerCase());
              result = result.concat(temp);
            }
            return result.substring(1);
        }
        function formatArr(arr) {
          let result = [];
          for (let element of arr) {
            result.push(element.charAt(0).toUpperCase().concat(element.substring(1)));
          }
          return result;
        }
      
        //Displays relevant books
        for(let i = 0; i < relevant.length; i++) {
          $("#list").append(`<li>${i+1}. ${relevant[i].title}<br>${relevant[i].author}<br>
            ${convert(relevant[i].genre)}<br>${convert(relevant[i].description)}<br><br><li>`);
          console.log(relevant[0]);
        }
        function convert(arr) {
          console.log(arr);
          let res = '';
          arr.forEach(element => res = res.concat(` ${element}`));
          return res.substring(1);
        }

    });

    return false;

  });