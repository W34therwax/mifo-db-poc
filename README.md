# mifo database schema, security rules and queries project of concept

## setup

create new project on firebase, name it 'mifo-dev' (if other name, adjust .firebaserc file)

init firestore in project (go to database tab and init)

go to `project settings` and create new web app for that project

copy firebaseConfig for web app that was created to src/roles and src/security files

run `npm install`

run `npm run deploy` - this will deploy firestore.rules and firestore.indexes.json files, you can see if it works in firebase console -> database tab -> rules and firebase console -> database tab -> indexes

run `npm run seed-firestore` - sample seeds to work on

if needed to reset db later, run `npm run purge-firestore` and then `npm run seed-firestore`

## role based authorization, firebase rules setup

Role can be created by admin from a set of abilities (permissions) and named freely. Role can be assigned to user and it is object-scoped, so role mean that given user can have a set of permissions to given object.

Roles are not used in gating access to firestore, only abilties are. Abilities are predefined (we can hardcode them in code or store in separate firestore collection).

Roles data is duplicated on users document to allow easier reads. I am not yet sure such duplication is needed, though I think it is, in some way - it will be more clear when we start developing it for real.

Roles info is stored on each object collection level (this I consider required) and on each users document (this is duplication for easy reads on users profile).

Each user document have roles object field that store all objects that user have access to and what roles for given object are granted.

Also, each user document have rolesIds array that store all roles user have, across all objects. This field serve as "an entrance" to roles field mentioned above - so its easy to find user with given role, when role is removed.

Each objects document have subcollection named metaUsers and it there are documents for each user that have some access to given document. Each of those users documents have subcollection named abilities. Each document in abilities collection have id that correspond to given abilitiy and one property - rolesIds that store an array of roles that granted given abitility.

That complicated path is then used for easy gating of access to firestore resources in firestore rules:

```javascript
    match /customers/{customer} {
      match /objects/{object} {
        function hasAbility(ability) {
          return exists(/databases/$(database)/documents/customers/$(customer)/objects/$(object)/metaUsers/$(request.auth.uid)/abilities/$(ability));
        }
        allow read: if hasAbility('createChecklist');
      }
    }
```
