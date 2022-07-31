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
const actionRemove= document.querySelector('#remove');
const actionAchieve=document.querySelector('#achieve');
const selectClubs= document.querySelector('#select-clubs');
const removeClubs=document.querySelector('#remove-clubs');
const selectAchievements=document.querySelector('#Achievements');
let approveAddRequestArray=document.querySelectorAll('.approve-add-request');
let approveRemoveRequestArray=document.querySelectorAll('.approve-remove-request');

let folder='Add';

//storing requests
let arr=[];

// functions
//add
let fetchAddRequests=async function(){
  arr=[];
  let ref= db.collection(`${folder}`);
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
        element.innerHTML=`<div class="add-request"><p id='id${i}'>Document Id : ${obj['id']}</p>
                          <p>Username : ${obj['username']}</p>
                          <p>Club : ${obj['clubs']}</p>
                          <button id='btn${i}' class="approve-add-request">Approve</button> <button class="disapprove-request">Disapprove</button></div>`
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
  selectAchievements.classList.add('inactive');
  removeClubs.classList.add('inactive');

  //fetching add requests
  fetchAddRequests();

});


function fetchRemoveRequests(){
  arr=[];
  let ref= db.collection(`${folder}`);
}

let fetchAchievements= async function(){
  arr=[];
  let ref= db.collection(`${folder}`);
  await ref.get().then((querySnapshot) => {

    querySnapshot.forEach(doc => {
        let obj={
          id:doc.id,
          username : doc.data().username,
          link:doc.data().link,
          description:doc.data().description,
          state:'false'
        }
        console.log(obj);
        if(!doc.state){
          arr.push(obj);
        }
    });
  });
}

let displayAchievements = async function(){
  let achievementDiv=document.querySelector('#Achievements');
  arr.forEach(async data => {
    let element=document.createElement('div');

    element.innerHTML=`<div class="Achievements01">
                        <p>username:${data['username']}</p>
                        <p>Achievement:<a href='${data.link}'>link</a></p>
                        <p>Description:${data.description}</p>
                        <button>Approve</button><button>Disapprove</button>
                      </div>`
    achievementDiv.append(element);
  });
}

actionAchieve.addEventListener('click',async ()=>{
  folder='Achievements';
  // selectClubs.classList.contains()
  selectClubs.classList.add('inactive');
  removeClubs.classList.add('inactive');
  selectAchievements.classList.remove('inactive');
  await fetchAchievements();
  displayAchievements();
});