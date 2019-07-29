  'use strict';

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
  let database = firebase.database();

  // Initialize entries
  database.ref().child("form data").set(true);

    $("#submit").on("click", function(event) {
        event.preventDefault();
        console.log("working");
  
      // Grabs user data entered into book finder
        let search = false;
        let genre = [];
        if(document.getElementById('mystery').checked) {
          genre.push('Mystery');
        }
        if(document.getElementById('romance').checked) {
          genre.push('Romance');
        }
        if(document.getElementById('classic').checked) {
          genre.push('Classic');
        }
        if(document.getElementById('nonfiction').checked) {
            genre.push('Nonfiction');
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
            return false;
        }
        let characteristics = {
            genre: genre,
            age: age
        }
        if (!search) characteristics = false;
      
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
          ngenre.push('Mystery');
        }
        if(document.getElementById('nromance').checked) {
          ngenre.push('Romance');
        }
        if(document.getElementById('nclassic').checked) {
          ngenre.push('Classic');
        }
        if(document.getElementById('nnonfiction').checked) {
          ngenre.push('Nonfiction');
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
          alert('Please complete this form.');
          return false;
        }
        if (!tempAuthor.includes(" ") && count == 5) {
          alert("Please enter the author's first and last name");
          return false;
        }

      let newBook = {
        title: ntitle,
        author: nauthor,
        genre: ngenre,
        age: nage,
        description: ndescription
      }
      console.log(newBook);
      //Checks if the book is in the database
      if (count == 5) {
        let completed = false;
        let ref = database.ref().orderByChild("title").equalTo(`${newBook.title}`);
        ref.on('value', function(snapshot) {
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
              end();
              if (search) window.location.href="../pages/display.html";
              return false;
            }
          }
          else if (!completed){
            console.log('added!');
            completed = true;
            database.ref().push(newBook);
            end();
            if (search) window.location.href="../pages/display.html";
            return false;
          }
        });
      }
      else {
        newBook = false;
        end();
        if (search) window.location.href="../pages/display.html";
        return false;
      }

    //Temporarily store form data in firebase
    function end() {
      let all = {
        target: characteristics,
        suggestion: newBook,
        search: search
      }
      database.ref().child('form data').update(all);
      clear();
    }

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

    return false;

    });
  });