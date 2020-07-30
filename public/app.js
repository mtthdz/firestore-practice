console.log(firebase)

// this can be cleaner when using React
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');
const userDetails = document.getElementById('userDetails');

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');


// SDKs 
// can be found in Firebase docs or Juno github docs
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();


// Sign in event handlers
// these are promises
signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();


auth.onAuthStateChanged(user => {
  if (user) {
    // signed in
    // this will toggle html sections
    whenSignedIn.hidden = false;
    whenSignedOut.hidden =  true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3>`
  } else {

    // signed out
    // will toggle html sections
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = ``;
  }
})


let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
  if (user) {
    // database reference
    // serverTimeStamp is server-side, whereas Date.now() is client-side
    thingsRef = db.collection('things');
    createThing.onClick = () => {
      const { serverTimeStamp} = firebase.firestore.FieldValue;

      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimeStamp(),
      });
    }

    // query
    unsubscribe = thingsRef
      .where('uid', '==', user.uid)
      // .orderBy('createdAt') // requires a query
      .onSnapshot(querySnapshot => {
        const items = querySnapshot.docs.map(doc => {
          return `<li>${doc.data().name}</li>`;
        });
        
        thingsList.innerHTML = items.join('');
      })
  } else {
    unsubscribe && unsubscribe();
  }
})