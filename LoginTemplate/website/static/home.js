const axios = window.axios;
const firebaseConfig = {
  apiKey: "AIzaSyAeaHc0agHVEGNC24xd8CnZWxD-IibrE7U",
  authDomain: "honeycomb2.firebaseapp.com",
  databaseURL: "https://honeycomb2-default-rtdb.firebaseio.com",
  projectId: "honeycomb2",
  storageBucket: "honeycomb2.appspot.com",
  messagingSenderId: "129839087943",
  appId: "1:129839087943:web:7f70c218de4682ed148c62",
};

// Initialize Firebase
//   const app = initializeApp(firebaseConfig);
const chatFireBase=firebase.initializeApp(firebaseConfig);

const username = document.getElementsByClassName("prof-name")[0].innerText;
document.cookie = `username=${username}`;
if(username==='admin'){
  const temp=document.querySelector('#AdminRequests').href="./static/admin.html";
}

//query selections

document.getElementById("NewsFeed").classList.add("active");
var folder = document.getElementsByClassName("active")[0].innerText;
fetchMessages();
console.log(folder);

let listItems = document.querySelectorAll('.list-items');
listItems.forEach(element => {
  element.addEventListener("click", function (e){
    e.preventDefault();
    folder = document.getElementsByClassName("active")[0].innerText;
    document.getElementsByClassName("active")[0].classList.remove("active");
    element.classList.add("active");
    document.getElementById("messages").remove();
    document.getElementById("wapisaao").innerHTML = "<ul id='messages'></ul>";
    folder = document.getElementsByClassName("active")[0].innerText;
    fetchMessages();
  })
});

// ye submit ke liye

document
  .getElementById("message-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    //AGAR ONLY TEXT
    if (
      document.querySelector("#image").files.length == 0 &&
      document.getElementById("message-input").value != ""
    ) {
      console.log("ONLY TEXT");

      const timestamp = Date.now();
      const messageInput = document.getElementById("message-input");

      const message = messageInput.value;

      // using sightengine for moderation
      //start

      console.log(message);
      const d = new FormData();
      d.append("text", message);
      d.append("lang", "en");
      d.append("opt_countries", "us,gb,fr");
      d.append("mode", "standard");
      d.append("api_user", "45211228");
      d.append("api_secret", "UwQPeDmdHyZBgpaKLUqF");
      fetch("https://api.sightengine.com/1.0/text/check.json", {
        method: "POST",
        body: d,
      })
        .then(function (response) {
          // on success: handle response
          console.log("success");

          return response.json();
        })
        .then(function (moderationJSON) {
          console.log(moderationJSON);
          let shouldSend = true;

          console.log(moderationJSON.personal);
          if (moderationJSON.personal.matches.length > 0) {
            alert("Don't send personal details");
            shouldSend = false;
          }
          console.log(moderationJSON.profanity);
          if (moderationJSON.profanity.matches.length > 0) {
            alert("Don't send inappropriate messages");
            shouldSend = false;
          }
          // end
          messageInput.value = "";

          document.getElementById("messages").scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });

          window.scrollBy(0, 100);
          var flag = 0;
          // isCode yaha hai
          let isCode=0;
          let isLink=0
          if (moderationJSON.link.matches.length > 0) {
            isLink=1;
            isCode=0;
            if (message.includes("https://pastebin.com/")) {
              isCode = 1;
              let pastebinCode = message.substring(21);
              console.log(pastebinCode);
            }
          }
          // create db collection and send in the data
          if (shouldSend == true) {
            chatFireBase
              .database()
              .ref(`${folder}/` + timestamp)
              .set({
                username,
                message,
                flag,
                isCode,
                isLink
              });
          }
        })
        .catch(function (error) {
          // handle error
          console.log("error");
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
      // end
    }
    //Agar only image
    else if (
      document.querySelector("#image").files.length != 0 &&
      document.getElementById("message-input").value == ""
    ) {
      const ref = chatFireBase.storage().ref();
      console.log("ONLY IMAGE");
      const file = document.querySelector("#image").files[0];
      console.log(file);
      const name = +new Date() + "-" + file.name;
      const metadata = { contentType: file.type };
      const task = ref.child(name).put(file, metadata);

      const timestamp = Date.now();
      task
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          console.log(url);
          axios
            .get("https://api.sightengine.com/1.0/check.json", {
              params: {
                url: url,
                models:
                  "nudity,wad,celebrities,offensive,faces,scam,text-content,face-attributes,gore,text,qr-content",
                api_user: "45211228",
                api_secret: "UwQPeDmdHyZBgpaKLUqF",
              },
            })
            .then(function (response) {
              // on success: handle response
              const moderationJSON = response.data;
              let alcohol = moderationJSON.alcohol;
              let drugs = moderationJSON.drugs;
              let gore = moderationJSON.gore.prob;
              let nPartial = moderationJSON.nudity.partial;
              let nRaw = moderationJSON.nudity.raw;
              let offensive = moderationJSON.offensive.prob;
              let qrProfanity = moderationJSON.qr.profanity.length;
              let scam = moderationJSON.scam.prob;
              let tProfanity = moderationJSON.text.profanity.length;
              let weapon = moderationJSON.weapon;
              let shouldSend = true;
              if (
                alcohol >= 0.2 ||
                drugs >= 0.2 ||
                gore >= 0.2 ||
                nPartial >= 0.1 ||
                nRaw >= 0.1 ||
                offensive >= 0.1 ||
                qrProfanity >= 0.1 ||
                scam >= 0.1 ||
                tProfanity >= 0.1 ||
                weapon >= 0.1
              ) {
                alert("Don't send inappropriate messages");
                shouldSend = false;
              }
              console.log(moderationJSON);
              if (shouldSend == true) {
                var flag = 1;
                chatFireBase
                  .database()
                  .ref(`${folder}/` + timestamp)
                  .set({
                    username,
                    url,
                    flag,
                  });
              }
            })
            .catch(function (error) {
              // handle error
              if (error.response) console.log(error.response.data);
              else console.log(error.message);
            });
        });
    } else {
      console.log("BOTH IMAGE AND TEXT");
      const ref = chatFireBase.storage().ref();
      const messageInput = document.getElementById("message-input");
      const message = messageInput.value;
      console.log(message);
      const file = document.querySelector("#image").files[0];
      console.log(file);
      const d = new FormData();
      d.append("text", message);
      d.append("lang", "en");
      d.append("opt_countries", "us,gb,fr");
      d.append("mode", "standard");
      d.append("api_user", "45211228");
      d.append("api_secret", "UwQPeDmdHyZBgpaKLUqF");
      fetch("https://api.sightengine.com/1.0/text/check.json", {
        method: "POST",
        body: d,
      })
        .then(function (response) {
          // on success: handle response
          console.log("success");

          return response.json();
        })
        .then(function (moderationJSON) {
          console.log(moderationJSON);
          let shouldSend = true;
          console.log(moderationJSON.personal);
          if (moderationJSON.personal.matches.length > 0) {
            alert("Don't send personal details");
            shouldSend = false;
          }
          console.log(moderationJSON.profanity);
          if (moderationJSON.profanity.matches.length > 0) {
            alert("Don't send inappropriate messages");
            shouldSend = false;
          }
          if (shouldSend == true) {
            console.log("checking image");

            const name = +new Date() + "-" + file.name;
            console.log(name);
            const metadata = { contentType: file.type };
            const task = ref.child(name).put(file, metadata);
            const timestamp = Date.now();
            task
              .then((snapshot) => snapshot.ref.getDownloadURL())
              .then((url) => {
                console.log(url);
                axios
                  .get("https://api.sightengine.com/1.0/check.json", {
                    params: {
                      url: url,
                      models:
                        "nudity,wad,celebrities,offensive,faces,scam,text-content,face-attributes,gore,text,qr-content",
                      api_user: "45211228",
                      api_secret: "UwQPeDmdHyZBgpaKLUqF",
                    },
                  })
                  .then(function (response) {
                    // on success: handle response
                    const modJSON = response.data;
                    let alcohol = modJSON.alcohol;
                    let drugs = modJSON.drugs;
                    let gore = modJSON.gore.prob;
                    let nPartial = modJSON.nudity.partial;
                    let nRaw = modJSON.nudity.raw;
                    let offensive = modJSON.offensive.prob;
                    let qrProfanity = modJSON.qr.profanity.length;
                    let scam = modJSON.scam.prob;
                    let tProfanity = modJSON.text.profanity.length;
                    let weapon = modJSON.weapon;
                    let shouldSend = true;
                    if (
                      alcohol >= 0.2 ||
                      drugs >= 0.2 ||
                      gore >= 0.2 ||
                      nPartial >= 0.1 ||
                      nRaw >= 0.1 ||
                      offensive >= 0.1 ||
                      qrProfanity >= 0.1 ||
                      scam >= 0.1 ||
                      tProfanity >= 0.1 ||
                      weapon >= 0.1
                    ) {
                      alert("Don't send inappropriate messages");
                      shouldSend = false;
                    }
                    console.log(modJSON);
                    if (shouldSend == true) {
                      console.log("added image and text");
                      var flag = 2;
                      chatFireBase
                        .database()
                        .ref(`${folder}/` + timestamp)
                        .set({
                          username,
                          url,
                          message,
                          flag,
                        });
                      document.querySelector("#image").value = null;
                    }
                  })
                  .catch(function (error) {
                    // handle error
                    if (error.response) console.log(error.response.data);
                    else console.log(error.message);
                  });
              });
          }
          // mf ends here
          messageInput.value = "";

          document.getElementById("messages").scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });

          window.scrollBy(0, 100);
        })
        .catch(function (error) {
          console.log("error");
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
      messageInput.value = "";
    }
    document.querySelector("#image").value = null;
  });
// ye fetch ke liye
function fetchMessages(){
  chatFireBase
  .database()
  .ref(`${folder}`)
  .on("child_added", function (snapshot) {
    const snap = snapshot.val();
    console.log("fetching messages")
    if (snap.flag == 0) {
      if(snap.isLink==0){
        const message = `<li class=${snap.username==username ? "sent" : "recieved"}><span><b>${snap.username} : <b></span>${snap.message}</li>`;
        document.getElementById("messages").innerHTML += message;
      }
      else{
        if(snap.isCode==1){
          console.log("trying to fetch code")
          let pastebinCode=snap.message.substring(21);
          console.log(pastebinCode);
          const message = `<li class=${snap.username==username ? "sent" : "recieved"}><span><b>${snap.username} : </b></span><a href="${snap.message}">${snap.message}</a><iframe src="https://pastebin.com/embed_iframe/${pastebinCode}?theme=dark" style="border:none;width:100%;"></iframe></li>`;
          document.getElementById("messages").innerHTML += message;
        }
        else{
          const message = `<li class=${snap.username==username ? "sent" : "recieved"}><span><b>${snap.username} : <b></span><a href="${snap.message}">${snap.message}</a></li>`;
          document.getElementById("messages").innerHTML += message;
        }
      }
    } else if (snap.flag == 1) {
      const message = `<li class=${snap.username==username ? "sent" : "recieved"}><span><b>${snap.username} : </b></span><img src="${snap.url}"></img></li>`;
      document.getElementById("messages").innerHTML += message;
    } else {
      const message = `<li class=${snap.username==username ? "sent" : "recieved"}><p><span><b>${snap.username} : </b></span>${snap.message} <br> <img src="${snap.url}"></p></li>`;
      document.getElementById("messages").innerHTML += message;
    }
  });
}
// var hamburger = document.querySelector(".hamburger");
// hamburger.addEventListener("click", function () {
//   document.querySelector("body").classList.toggle("active");
// });
