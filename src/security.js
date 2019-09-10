const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
  // HERE PUT YOU FIREBASE CONFIG VALUES
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// RESTRICT ACCESS BASED ON ABILITIES
// as an example I have gated (in firestore.rules file) access to read objects document 
// for users that have "createChecklist" ability, to check if that work, change in firestore.rules
// line:  "allow read: if hasAbility('createChecklist')"  for an non existing ability name.
db.collection("customers")
  .doc("Axbit")
  .collection("objects")
  .doc("CSCPo7xVZDFbEj6oPHqu")
  .get()
  .then(snapshot => {
    console.log(snapshot.id, "=>", snapshot.data());
  })
  .catch(err => {
    console.log("Error getting documents", err);
  });