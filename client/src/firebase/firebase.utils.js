import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyCHaTCc3X_yszredjlepmPhC2sMUfggTJc',
  authDomain: 'reviewio.firebaseapp.com',
  databaseURL: 'https://reviewio.firebaseio.com',
  projectId: 'reviewio',
  storageBucket: 'reviewio.appspot.com',
  messagingSenderId: '838467410942',
  appId: '1:838467410942:web:02552c18157965c056beaf',
  measurementId: 'G-LZT7X0XPZF',
};

firebase.initializeApp(config);

let storageRef = firebase.storage().ref();

export const uploadImage = async (fileName, file, folder) => {
  let imageFile = new Blob([file], { type: 'image/jpeg' });
  const imageRef = storageRef.child(`${folder}/${fileName}`).put(imageFile);
  return imageRef;
  // imageRef.on('state_changed', async function () {
  //   let downloadURL = await imageRef.snapshot.ref.getDownloadURL();
  //   console.log(downloadURL);
  // });
};

export const getImageURL = async (currRef) => {
  let url = await currRef.ref.getDownloadURL();
  return url;
};
