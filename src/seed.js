const admin = require('firebase-admin');

admin.initializeApp();


const db = admin.firestore();
const batch = db.batch();


// ROLES
const observerRef = db.collection('roles').doc('observer');
batch.set(observerRef, {viewReports: true});

const ownerRef = db.collection('roles').doc('owner');
batch.set(ownerRef, {viewReports: true, generateReports: true, createChecklist: true, performChecklist: true});

// CUSTOMERS
const customerAxbitRef = db.collection('customers').doc('Axbit');
batch.set(customerAxbitRef, { name: 'Axbit' });

// OBJECTS
const topObjectRef = customerAxbitRef.collection('objects').doc();
//TODO: real attachments IDS
batch.set(topObjectRef, { parent: false, level: 1, name: 'HQ', type: 'object type', attachments: ['id1', 'id2', 'id3'] });

const subObjectRef = customerAxbitRef.collection('objects').doc();
//TODO: real attachments IDS
batch.set(subObjectRef, { parent: topObjectRef.id, level: 2, name: 'Conference room', type: 'object type', attachments: ['id3', 'id4', 'id5'] });

// USERS
const UserARef = db.collection('users').doc();
batch.set(UserARef, {uid: 'uniqueAuthUid', username: 'userA', name: 'Jon', email: 'jon@gmail.com', phone: '123456789', roles: {[topObjectRef.id]: ['owner', 'observer'], [subObjectRef.id]: ['observer']}, rolesIds: ['owner', 'observer']})

// METAUSERS and ABILITIES - store users that have access to given object and what access (abilities) thay have
const metaUserRef = topObjectRef.collection('metaUsers').doc('uniqueAuthUid');
batch.set(metaUserRef, { exist: true }); //no need for any data on that doc, but empty docs got deleted, so this is a workaround

const abilitiesRef = metaUserRef.collection('abilities').doc('viewReports');
batch.set(abilitiesRef, {rolesIds:  ['observer', 'owner']});

const abilities2Ref = metaUserRef.collection('abilities').doc('generateReports');
batch.set(abilities2Ref, {rolesIds:  ['owner']});

const abilities3Ref = metaUserRef.collection('abilities').doc('createChecklist');
batch.set(abilities3Ref, {rolesIds:  ['owner']});

const abilities4Ref = metaUserRef.collection('abilities').doc('performChecklist');
batch.set(abilities4Ref, {rolesIds:  ['owner']});

// // CHECKPOINTS
// const checkpointARef = db.collection('checkpoints').doc('EL01-01');
// batch.set(checkpointARef, {text: 'checkpoint description', category: 'electrical', createdBy: UserARef.id, createdAt: admin.database.ServerValue.TIMESTAMP})

// const checkpointBRef = db.collection('checkpoints').doc('EL06-01');
// batch.set(checkpointBRef, {text: 'another checkpoint description', category: 'electrical', createdBy: UserARef.id, createdAt: admin.database.ServerValue.TIMESTAMP})


batch
  .commit()
  .then(function() {
    console.log('Document successfully written!') && process.exit();
  })
  .catch(function(error) {
    console.error('Error writing document: ', error) && process.exit();
  });