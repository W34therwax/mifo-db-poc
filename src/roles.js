const firebase = require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
  // HERE PUT YOU FIREBASE CONFIG VALUES
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// STEPS WHEN ROLE IS EDITED / DELETED
console.log("EXAMPLE - admin delete owner role");
const roleToBeDeleted = "owner";
// get all abilities that were granted by role 'owner'
db.collectionGroup("abilities")
  .where("rolesIds", "array-contains", roleToBeDeleted)
  .get()
  .then(abiltiesSnapshot => {
    // if ability is granted only by role 'owner', remove that ability,
    // if more roles grant that ability, just remove owner property from ability doc
    abiltiesSnapshot.docs.map(abilityDocSnapshot => {
      const rolesIds = abilityDocSnapshot.data().rolesIds;
      if (rolesIds.length === 1) {
        abilityDocSnapshot.ref.delete();
      } else {
        abilityDocSnapshot.ref.update({
          rolesIds: rolesIds.filter(role => role !== roleToBeDeleted)
        });
      }
    });
  })
  .catch(err => {
    console.log("Error getting documents", err);
  });

db.collection("users")
  .where("rolesIds", "array-contains", roleToBeDeleted)
  .get()
  .then(usersSnapshot => {
    console.log('clear users docs from deleted role')
    //here users documents have to be updated - role removed from rolesIds and roles fields.
  })
  .catch(err => {
    console.log("Error getting documents", err);
  });

// NEW ROLE
// this is simple, just new document on 'roles' root collection

// ASSIGN USER ROLE FOR GIVEN OBJECT
// 1. add to user document, roles field new entry with object ID and role that is assigned
// 2. to same document add entry that user have new role to rolesIds array (assuming it is not there already)
// 3. to customers/customerId/objects/objectId/metaUsers add new entry
