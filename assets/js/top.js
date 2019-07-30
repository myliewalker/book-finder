'use strict';

$(document).ready(function() {
    console.log('top ready');
    
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

    let top = [];
    database.ref().on('value', function(snapshot) {
        let keys = Object.keys(snapshot.val());
        if (keys.length <= 100) {
            keys.forEach(key => top.push(snapshot.child(key).val()))
        }
        else {
            keys.sort(function(a, b) {
                let bookA = snapshot.child(a).val();
                let bookB = snapshot.child(b).val();
                if (mostPopular(bookA, bookB) != 0) return mostPopular(bookA, bookB);
                if (byAuthor(bookA, bookB) != 0) return byAuthor(bookA, bookB);
                return byTitle(bookA, bookB);
            });
            for (let i = 0; i < 100; i++) {
                top.push(snapshot.child(keys[i]).val());
            }
        }
        display(top);
    });

    function mostPopular(bookA, bookB) {
        if (bookA.description.length > bookB.description.length) return -1;
        if (bookA.description.length < bookB.description.length) return 1;
        return 0;
    }
    function byAuthor(bookA, bookB) {
        if (bookA.author.split(" ")[1] < bookB.author.split(" ")[1]) return -1;
        if (bookA.author.split(" ")[0] > bookB.author.split(" ")[0]) return 1;
        return 0;
    }
    function byTitle(bookA, bookB) {
        if (bookA.title < bookB.title) return -1;
        if (bookA.title > bookB.title) return 1;
        return 0;
    }

    function display() {
        console.log(top.length);
        for(let i = 0; i < top.length; i++) {
            if (top[i].genre) {
                $("#list").append(`<li><h3>${i+1}. <span id="title">${top[i].title}</span></h3>&nbsp&nbsp&nbsp&nbsp${top[i].author}<br>&nbsp&nbsp&nbsp
                ${convert(top[i].genre)}<br>&nbsp&nbsp&nbsp&nbsp${transform(top[i].description)}<br><br><li>`);
            }
            else {
                $("#list").append(`<li><h3>${i+1}. <span id="title">${top[i].title}</span></h3>&nbsp&nbsp&nbsp&nbsp${top[i].author}<br>&nbsp&nbsp&nbsp
                ${transform(top[i].description)}<br><br><li>`);
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
        desc.forEach(d => res = res.concat(`\n${d.source}: ${d.review}`));
        return res.substring(1);
    }
});