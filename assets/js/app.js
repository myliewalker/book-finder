$(document).ready(function(){
    console.log ("ready!");
   // Initialize Firebase
   var config = {
    apiKey: "AIzaSyBzvvSTdq17EAnncHWZ6YpHTykWWUs_Qvs",
    authDomain: "book-finder-6cc03.firebaseapp.com",
    databaseURL: "https://book-finder-6cc03.firebaseio.com",
    projectId: "book-finder-6cc03",
    storageBucket: "",
    messagingSenderId: "893603769974"
  };
  firebase.initializeApp(config);

  
  // holds the firebase the data
  var database = firebase.database();
      // button for adding adding volunteers
      $("#submit").on("click", function(event) {
        event.preventDefault();
        console.log("working");
  
      // Grabs user data entered into book finder
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
        if (genre.length == 0 && age || genre.length > 0 && !age) {
            alert('Please complete all sections of finder.')
            return false;
        }
        let characteristics = {
            genre: genre,
            age: age
        }
      
      // Adds book suggestion to bank
        let ntitle = $("#ntitle").val();
        let nauthor = $("#nauthor").val();
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
        let ndescription = $("#ndescription").val();
        let count = 0;
        if (ntitle) count++;
        if (nauthor) count++;
        if (ngenre.length > 0) count++;
        if (nage) count++;
        if (ndescription) count++;
        if (count != 0 && count != 5) {
          alert('Please complete your entire suggestion.');
          return false;
        }

        //Validate form data
        if (count == 0 && genre.length == 0) {
          alert('Please complete this form.');
        }

        let newBook = {
          title: ntitle,
          author: nauthor,
          genre: ngenre,
          age: nage,
          description: ndescription
        }

        database.ref().push(newBook);

    console.log(newBook.title, newBook.author, newBook.genre, newBook.description, newBook.age);
    // module.exports.newBook = newBook;

  // Clears all of the inputs
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
    $('#mystery').prop('checked', false)
    $('#romance').prop('checked', false)
    $('#classic').prop('checked', false)
    $('#nonfiction').prop('checked', false)
    $('#kid').prop('checked', false)
    $('#young').prop('checked', false)
    $('#adult').prop('checked', false)
  
    return false;
  
    });
  
      // Firebase watcher + initial loader HINT: .on("value")
      database.ref().on("child_added", function(childSnapshot){
          console.log(childSnapshot.val());
      });
  });