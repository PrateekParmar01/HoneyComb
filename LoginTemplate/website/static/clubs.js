'use strict'
console.log('inside clubs.js')
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

const fireClubs=firebase.initializeApp(firebaseConfig,'Secondary');
const db2 = fireClubs.firestore();

const username = document.getElementsByClassName("prof-name")[0].innerText;


let fetchDetails = async function(clubs='|news|Students|'){
    let ref= db2.collection(`Final`)
    await ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let obj=doc.data();
        if(obj['username']===username){

          clubs+=obj['clubs'];
        }
      });
    })
    return clubs;
}
let splitVals=async (clubs)=>{
  let arr=[];
  console.log(clubs)
  let str='';
  for(let i=1;i<clubs.length;i++){
    let chr=clubs.charAt(i);
    if(chr=='|'){
      if(str!='')
        arr.push(str);
      str='';
      continue;
    }
    str+=chr;
  }
  return arr;
}

let displayClubs =async () =>{
  let clubList=document.querySelectorAll('.list-items');

  let clubs=await fetchDetails();
  let arr=await splitVals(clubs);
  console.log(arr);
  clubList.forEach(club => {
    let parEle = club.parentNode;
    let naam=parEle.getAttribute('name');
    console.log(naam);
    if(!(arr.includes(naam))){
      parEle.classList.add('inactive');
    }
  });
}
displayClubs();
