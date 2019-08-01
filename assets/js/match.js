  
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
        if (!snapshot.val() || snapshot.numChildren() <= 1) {
          console.log('No books are in the database');
          return false;
        }

        //Grabs form data and removes it from firebase
        let keys = Object.keys(snapshot.val());
        keys.pop();
        let data = snapshot.child('form data').val();
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
                if (g == target.genre || !target.genre) return true;
                return false;
            })
          });
        //Filters by age
        let relevant = correctGenre.filter(book => book.age == target.age || !book.age);

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
        console.log(relevant);
        display();
      
        // Displays relevant books
        function display() {
          for(let i = 0; i < relevant.length; i++) {
              $("#list").append(`<div class="col-sm-1" style="text-align:left"><h3>${i+1}.</h3></div>`)
              if (relevant[i].genre) {
                  $("#list").append(`<div class="col-lg-11"><h3><span id="title">${relevant[i].title}</span></h3>${relevant[i].author}<br>
                  ${convert(relevant[i].description)}</div>`)
              }
              else {
                  $("#list").append(`<div class="col-lg-11" id="body"><h3><span id="title">${relevant[i].title}</span></h3>${relevant[i].author}<br>
                  ${transform(relevant[i].description)}</div>`)
              }
          }   
      }
      function convert(arr) {
          let res = '';
          arr.forEach(element => res = res.concat(` ${element}`));
          return res.substring(1);
      }
      function transform(desc) {
          let res = '';
          desc.forEach(d => {
              res = res.concat(`\n${d.source}: ${d.review}`);
          });
          return res.substring(1);
      }

    });

    return false;

});