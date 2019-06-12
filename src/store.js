import { createStore, combineReducers, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
// Reducers
import notifyReducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';

const firebaseConfig = {
  apiKey: 'AIzaSyD0EIkQcC65K9iUQFbWMGBEpvVTwAhBThY',
  authDomain: 'client-panel-e5b49.firebaseapp.com',
  databaseURL: 'https://client-panel-e5b49.firebaseio.com',
  projectId: 'client-panel-e5b49',
  storageBucket: '',
  messagingSenderId: '810035555863',
  appId: '1:810035555863:web:4aa81d1e28722243'
};

// React-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
};

// Init firebase instance
firebase.initializeApp(firebaseConfig);

// Init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add rrf enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

// Check for settings in localStorage
if (localStorage.getItem('settings') == null) {
  // Default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: true
  };

  // Set to localstorage
  localStorage.setItem('settings', JSON.stringify(defaultSettings));
}

// Create inital state
const initialState = { settings: JSON.parse(localStorage.getItem('settings')) };

// Create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  composeWithDevTools(reactReduxFirebase(firebase))
);

export default store;
