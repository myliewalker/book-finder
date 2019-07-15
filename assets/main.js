
  'use strict';
  
    // module.exports = ('test top');
    // return false;
  
  $(document).ready(function(){
      console.log ("ready!");
     
      // Initialize Firebase
     let config = {
      apiKey: "AIzaSyBzvvSTdq17EAnncHWZ6YpHTykWWUs_Qvs",
      authDomain: "book-finder-6cc03.firebaseapp.com",
      databaseURL: "https://book-finder-6cc03.firebaseio.com",
      projectId: "book-finder-6cc03",
      storageBucket: "",
      messagingSenderId: "893603769974"
    };
    firebase.initializeApp(config);
  
    // Firebase database
    let database = firebase.database();

    function resolveAfter2Seconds() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(cont());
        }, 2000);
      });
    }
    checkValid();

    function cont() {
    if (window.valid == false) {console.log('here'); return false};
    if (window.search) {
      window.href.location = '..pages/display.html';
      display(window.target, window.newBook);
    }
  }

    return false;
    
    //ISSUE: exports returning null bc of submit on click
    async function checkValid() {
        $("#submit").on("click", function(event) {
          event.preventDefault();
          console.log("working");
          window.valid = true;
    
        // Grabs user data entered into book finder
          let search = false;
          let genre = [];
          if(document.getElementById('mystery').checked) {
            genre.push('mystery');
          }
          if(document.getElementById('romance').checked) {
            genre.push('romance');
          }
          if(document.getElementById('classic').checked) {
            genre.push('classic');
          }
          if(document.getElementById('nonfiction').checked) {
              genre.push('nonfiction');
          }
          let age;
          if(document.getElementById('kid').checked) {
            age = 'kid';
          }
          else if(document.getElementById('young').checked) {
            age = 'young';
          }
          else if(document.getElementById('adult').checked) {
            age = 'adult';
          }
          if (genre.length > 0 || age) search = true;
          if (search && (genre.length == 0 || !age)) {
              alert('Please complete all sections of finder.')
              window.valid = false;
              return false;
          }
          let characteristics = {
              genre: genre,
              age: age
          }
        
        // Adds book suggestion to library
          let ntitle = $("#ntitle").val();
          if (ntitle) ntitle.toLowerCase();
          let tempAuthor = $("#nauthor").val();
          let nauthor;
          if (tempAuthor) {
            tempAuthor = tempAuthor.replace(/(\w+), (\w+)/, "$2 $1");
            nauthor = tempAuthor.toLowerCase();
          }
          let ngenre = [];
          if(document.getElementById('nmystery').checked) {
            ngenre.push('mystery');
          }
          if(document.getElementById('nromance').checked) {
            ngenre.push('romance');
          }
          if(document.getElementById('nclassic').checked) {
            ngenre.push('classic');
          }
          if(document.getElementById('nnonfiction').checked) {
            ngenre.push('nonfiction');
          }
          let nage;
          if(document.getElementById('nkid').checked) {
            nage = 'kid';
          }
          else if(document.getElementById('nyoung').checked) {
            nage = 'young';
          }
          else if(document.getElementById('nadult').checked) {
            nage = 'adult';
          }
          let ndescription = [];
          if ($("#ndescription").val() != '') ndescription.push($("#ndescription").val());
          let count = 0;
          if (ntitle) count++;
          if (tempAuthor) count++;
          if (ngenre.length > 0) count++;
          if (nage) count++;
          if (ndescription.length > 0) count++;
          if (count != 0 && count != 5) {
            alert('Please complete your entire suggestion.');
            return false;
          }
  
          //Validates form data
          if (count == 0 && search == false) {
            alert('Please complete window form.');
            window.valid = false;
            return false;
          }
          if (!tempAuthor.includes(" ") && count == 5) {
            alert("Please enter the author's first and last name");
            window.valid = false;
            return false;
          }
  
        //Return if a search
          let newBook = {
            title: ntitle,
            author: nauthor,
            genre: ngenre,
            age: nage,
            description: ndescription
          }
  
        //Checks if the book is in the database
        if (count == 5) {
          let completed = false;
          let ref = database.ref().orderByChild("title").equalTo(`${newBook.title}`);
          ref.once('value', function(snapshot) {
            let key;
            if (snapshot.val() && !completed) { 
              key = Object.keys(snapshot.val())[0];
              if (key) {
                console.log('found!');
                let newGenre = newBook.genre;
                snapshot.child(key).val().genre.forEach(g => newGenre.push(g));
                let newDescription = newBook.description;
                snapshot.child(key).val().description.forEach(d => newDescription.push(d));
                database.ref().child(key).update({genre: newGenre, description: newDescription});
                clear();
                return false;
              }
            }
            else if (!completed){
              console.log('added!');
              completed = true;
              database.ref().push(newBook);
            }
          });
        }
  
      // Exports values
      // console.log('exports');
      window.target = characteristics,
      window.suggestion = newBook,
      window.search = search
      window.valid = true;
    
      //Clears all of the inputs
      function clear() {
        $("#ntitle").val("");
        $("#nauthor").val("");
        $("#ngenre").val("");
        $("#ndescription").val("");
        $('#nmystery').prop('checked', false)
        $('#nromance').prop('checked', false)
        $('#nclassic').prop('checked', false)
        $('#nnonfiction').prop('checked', false)
        $('#nkid').prop('checked', false)
        $('#nyoung').prop('checked', false)
        $('#nadult').prop('checked', false)
  
        $("#genre").val("");
        $('#mystery').prop('checked', false)
        $('#romance').prop('checked', false)
        $('#classic').prop('checked', false)
        $('#nonfiction').prop('checked', false)
        $('#kid').prop('checked', false)
        $('#young').prop('checked', false)
        $('#adult').prop('checked', false)
      }
  
    //Clears and returns
      clear();
      return false;
      });
    };

  ;
    function display(target, suggestion) {
        console.log('display ready!');
        database.ref().on('value', function(snapshot) {
          if (!snapshot.val()) {
            console.log('No books are in the database');
            return false;
          }
  
          //Separates all firebase objects, then adds them to a list of books
          let books = [];
          let keys = Object.keys(snapshot.val());
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
  
          console.log('requires' + target);
          
          //Checks if a request is made
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
              book.title = format(book.title);
              book.author = format(book.author);
          });
          function format(str) {
              let result = '';
              for (let word of str.split(' ')) {
                  let temp = `${word.substring(0,1).toUpperCase()} ${word.substring(1)}`;
                  result.concat(temp);
              }
              return result;
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
  
    // };
    }

    return false;
  
  });