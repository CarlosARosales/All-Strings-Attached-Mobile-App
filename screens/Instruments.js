import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import styles from "./Styles";
import firestore from "@react-native-firebase/firestore";
import firebase from "firebase/app";
require("firebase/firestore");
require("firebase/firebase-storage");
import { List } from "react-native-paper";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Instruments(props) {
  const { currentUser, instruments, rawTimeStamp } = props;
  const [showBox, setShowBox] = useState(true);

  const deleteInstrument = (item) => {
    firebase
      .firestore()
      .collection("instruments")
      .doc(firebase.auth().currentUser.uid)
      .collection("userInstruments")
      .doc(item)
      .delete()
      .then(function () {
        console.log("item deleted");
      });
  };

  const showConfirmDialog = (item) => {
    console.log("hello");
    console.log(item);

    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this instrument?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            deleteInstrument(item);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  console.log(currentUser, instruments, rawTimeStamp);
  return (
    <View style={instrumentStyles.container}>
      <View style={instrumentStyles.containerGallery}>
        <FlatList
          horizontal={false}
          data={instruments}
          renderItem={({ item }) => (
            <View style={instrumentStyles.instrumentCard}>
              <View style={instrumentStyles.deleteInstrumentContainer}>
                <View>
                  <Text style={instrumentStyles.title}>
                    {item.instrumentName}
                  </Text>
                </View>
                <View style={instrumentStyles.deleteButtonContainer}>
                  <TouchableOpacity onPress={() => showConfirmDialog(item.id)}>
                    <MaterialCommunityIcons
                      name="delete"
                      color={"white"}
                      size={32}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={instrumentStyles.imageContainer}></View>
              <Text style={instrumentStyles.otherText}>
                Model: {item.instrumentModel}
              </Text>
              <Text style={instrumentStyles.otherText}>Year: {item.year}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  instruments: store.userState.instruments,
});

const instrumentStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "5%",
  },
  buttonText: {
    color: "#EBEBF5",
  },
  otherText: {
    color: "rgba(235, 235, 245, 0.6)",
    marginTop: "2%",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  containerGallery: {
    flex: 1,
  },
  instrumentCard: {
    borderRadius: 20,
    backgroundColor: "#2C2C2E",
    padding: 20,
    marginVertical: "3%",
    marginHorizontal: "5%",
  },
  deleteInstrumentContainer: {
    flexDirection: "row",
  },
  deleteButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  deleteInstrumentButton: {
    backgroundColor: "red",
    width: "60%",
    padding: "3%",
    borderRadius: 15,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",

    backgroundColor: "black",
  },
});

export default connect(mapStateToProps, null)(Instruments);
