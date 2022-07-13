'use strict'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArAd2bmZvSI9DjNA56xFwNivNWm3dTz2M",
  authDomain: "honeycomb-8451f.firebaseapp.com",
  projectId: "honeycomb-8451f",
  storageBucket: "honeycomb-8451f.appspot.com",
  messagingSenderId: "503364608959",
  appId: "1:503364608959:web:cba5ad91270e92f34d770a",
  measurementId: "G-2XNP6083TK",
};

// Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// query selection
const actionAdd= document.querySelector('#add');
const actionRemove= document.querySelector('#remove')
const selectClubs= document.querySelector('#select-clubs');
const removeClubs=document.querySelector('#remove-clubs');
let approveAddRequestArray=document.querySelectorAll('.approve-add-request');
let approveRemoveRequestArray=document.querySelector('.approve-remove-request');
let folder='Add';

//storing requests
let arr=[];

// functions
//add
let fetchAddRequests=async function(){
  arr=[];
  let ref= db.collection(`${folder}`)
  await ref.get().then((querySnapshot) => {
    let i=0
    querySnapshot.forEach((doc) => {
        let obj={
          'id':doc.id,
          'username':doc.data().username,
          'clubs':doc.data().clubs
        }
        arr.push(obj);
        let element= document.createElement('div');
        element.innerHTML=`<p id='id${i}'>Document Id : ${obj['id']}</p>
                          <p>Username : ${obj['username']}</p>
                          <p>Club : ${obj['clubs']}</p>
                          <button id='btn${i}' class="approve-add-request">Approve</button> <button>Disapprove</button>`
        document.querySelector('#add-requests').append(element);
        i++;
        // console.log(`${doc.id} => ${doc.data()}`);
    });
    console.log(arr);
    approveAddRequestArray=document.querySelectorAll('.approve-add-request');
    console.log(approveAddRequestArray);
  });
}

let addFunction = async function(){
  await fetchAddRequests();
  //approving add request
  console.log(approveAddRequestArray);
  //iterating
  approveAddRequestArray.forEach(element => {
    element.addEventListener('click',()=>{
      console.log('inside add request')
      element.parentNode.classList.add('inactive')
      let obj=arr[element.id.substring(3)];
      console.log(obj);
      db.collection("Final").doc(obj['id']).set({
        username : obj['username'],
        clubs : obj['clubs'],
        state : "approved",
      })
      .then(() => {
          console.log("Document successfully written!");
          db.collection("Add").doc(obj['id']).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
      })
      .catch((error) => {
          console.error("Error writing document: ", error);
      });
    });

  });
}

addFunction();

//selecting add or remove
actionAdd.addEventListener('click',()=>{
  console.log('inside add')

  // selecting folder
  folder='Add';

  //making add active
  selectClubs.classList.remove('inactive');
  removeClubs.classList.add('inactive');

  //fetching add requests
  fetchAddRequests();

});

actionRemove.addEventListener('click',()=>{
  console.log('inside remove')

  // selecting folder
  folder='Remove'

  //making remove active
  selectClubs.classList.add('inactive');
  removeClubs.classList.remove('inactive');

  //fetching remove requests
});

function fetchRemoveRequests(){
  arr=[];

}