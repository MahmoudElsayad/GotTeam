import { AppRegistry } from 'react-native';
import App from './App';
import * as firebase from 'firebase';
import 'firebase/firestore';


firebase.initializeApp({
    apiKey: "AIzaSyBBimKZZWGNpglFy4mletNjWKmR6_FIYdE",
    authDomain: "got-team.firebaseapp.com",
    databaseURL: "https://got-team.firebaseio.com",
    projectId: "got-team",
    storageBucket: "got-team.appspot.com",
    messagingSenderId: "751375878608",
    timestampsInSnapshots: true,
});

const settings = { timestampsInSnapshots: true };

firebase.firestore().settings(settings);

AppRegistry.registerComponent('GotTeam', () => App);
