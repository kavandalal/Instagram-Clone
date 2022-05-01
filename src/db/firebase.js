import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyDJMHGfRGqfqSW4jvYUJecHdcF24F7CXxo',
	authDomain: 'instagram--react-clone.firebaseapp.com',
	projectId: 'instagram--react-clone',
	storageBucket: 'instagram--react-clone.appspot.com',
	// storageBucket: 'gs://instagram--react-clone.appspot.com/',
	messagingSenderId: '14051211620',
	appId: '1:14051211620:web:e5c781fa2bc43d2a3c6271',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
