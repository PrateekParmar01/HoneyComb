// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
// import { getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
// // https://firebase.google.com/docs/web/setup#available-libraries
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArAd2bmZvSI9DjNA56xFwNivNWm3dTz2M",
  authDomain: "honeycomb-8451f.firebaseapp.com",
  projectId: "honeycomb-8451f",
  storageBucket: "honeycomb-8451f.appspot.com",
  messagingSenderId: "503364608959",
  appId: "1:503364608959:web:cba5ad91270e92f34d770a",
  measurementId: "G-2XNP6083TK",
};

// Initialize Firebase ,Firestore and storeage
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage =firebse.storage();

//selecting cookies
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

document.querySelector('#send').addEventListener('click', () =>{
    const allCheckBoxes=document.querySelectorAll('.checklist');
    console.log(allCheckBoxes);
    let clubs="|";
    allCheckBoxes.forEach(element => {
        if(element.checked===true){
            clubs+=(element.name).toString()+'|';
        }
    });
    if(clubs==='|')
        clubs+='|';
    console.log(clubs);
    let uname=getCookie('username');
    db.collection("Add").add({
        username:uname,
        clubs:clubs
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

});

document.querySelector('#submit-image').addEventListener('click',(e)=>{
  e.preventDefault();
  
})
