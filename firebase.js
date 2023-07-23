// Import the functions you need from the SDKs you need
const  { initializeApp } = require( "firebase/app");
require( 'firebase/storage');
const { getStorage } =require( 'firebase/storage');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAibYen5Wtez000paf86GeLq8SDnJDjp0s",
  authDomain: "cric-streamers.firebaseapp.com",
  projectId: "cric-streamers",
  storageBucket: "cric-streamers.appspot.com",
  messagingSenderId: "862535089662",
  appId: "1:862535089662:web:bc3e217112f490833ed4af"
}; 

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);
module.exports = {firebase,storage};
