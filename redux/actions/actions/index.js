import firebase from "firebase";
import {
  USER_INSTRUMENTS_STATE_CHANGE,
  USER_STATE_CHANGE,
} from "../constants/index";

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("does not exist");
        }
      });
  };
}

export function fetchUserInstruments() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("instruments")
      .doc(firebase.auth().currentUser.uid)
      .collection("userInstruments")
      .get()
      .then((snapshot) => {
        let instruments = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        console.log(instruments);
        dispatch({ type: USER_INSTRUMENTS_STATE_CHANGE, instruments });
      });
  };
}
