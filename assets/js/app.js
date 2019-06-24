$(document).ready(function(){
    console.log ("ready!");
   // Initialize Firebase
   var config = {
    apiKey: "AIzaSyBEqLaREsvuoIpsuXMkORKnST1JLboUHU0",
    authDomain: "volunteer-project-932da.firebaseapp.com",
    databaseURL: "https://volunteer-project-932da.firebaseio.com",
    projectId: "volunteer-project-932da",
    storageBucket: "",
    messagingSenderId: "608058845701"
  };
  firebase.initializeApp(config);
  
  
  
  // holds the firebase the data
  var database = firebase.database();
  
      // button for adding adding volunteers
      $("#submit").on("click", function(event) {
        // Don't refresh the page!
        event.preventDefault();
        console.log("working");
  
      // Grabs user data entered into the form controls
        let genre;
        if(document.getElementById('mystery').checked) {
          genre = 'mystery';
        }
        else if(document.getElementById('romance').checked) {
          genre = 'romance';
        }
        else if(document.getElementById('classic').checked) {
          genre = 'classic';
        }
        else genre = 'nonfiction';

        let age;
        if(document.getElementById('kid').checked) {
          age = 'kid';
        }
        else if(document.getElementById('young').checked) {
          age = 'young';
        }
        else age = 'adult';
      
      // Adds book suggestion to bank
        let ntitle = $("#ntitle").val();
        let nauthor = $("#nauthor").val();
        let ngenre = $("#ngenre").val();
        let ndescription = $("#ndescription").val();
        let count = 0;
        if (ntitle) count++;
        if (nauthor) count++;
        if (ngenre) count++;
        if (ndescription) count++;
        if (count != 0 && count != 4) {
          alert('Please complete the entire form.');
          return false;
        }
  
        var newBook = {
          title: ntitle,
          author: nauthor,
          genre: ngenre,
          description: ndescription,
          age: nage
        }
  
        database.ref().push(newBook);
  
    console.log(newBook.title, newBook.author, newBook.genre, newBook.description, newBook.age);
    module.exports.newBook = newBook;

  
  // Clears all of the inputs
    $("#ntitle").val("");
    $("#nauthor").val("");
    $("#ngenre").val("");
    $("#ndescription").val("");
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
      database.ref().on("child_added", function(childSnapshot, prevChildKey){
  
          console.log(childSnapshot.val());
  
  
      // Stores everything into a variable.
      var tbirthday = childSnapshot.val().birthday;
      var temail = childSnapshot.val().email;
      var tfirstname = childSnapshot.val().firstname;
      var tlastname = childSnapshot.val().lastname;
      var tmiddlename = childSnapshot.val().middlename;
      var tphonenumber = childSnapshot.val().phonenumber;
      var tinterests = childSnapshot.val().interests;
  
    });
  });