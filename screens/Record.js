import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  PermissionsAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./Styles";
import { Audio } from "expo-av";

import firebase from "firebase";

require("firebase/firestore");
require("firebase/firebase-storage");

//const reference = storage().ref('black-t-shirt-sm.png');

const requestAudioPermission = async () => {
  console.log("permissiooonnss");
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: "Request for Recording Permission",
      message: "Audio Recording Requires Permission",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    }
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export default function Record() {
  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log("Requesting permissions..");

      //const permission = await requestAudioPermission();

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    const childPath = `recording/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;

    const task = firebase
      .storage()
      .ref()
      .child(childPath)
      .put(uri, { contentType: `audio/.m4a` });

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = (snaphot) => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);

    console.log("Recording stopped and stored at", uri);
  }

  return (
    <>
      <View>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Record</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={recordStyle.container}>
          <View style={recordStyle.containerGallery}>
            <View style={recordStyle.cardContainer}>
              <View>
                <Text style={recordStyle.title}>Record</Text>
              </View>
              <View style={recordStyle.buttonContainer}>
                <TouchableOpacity
                  style={recordStyle.buttonStyle}
                  onPress={recording ? stopRecording : startRecording}
                >
                  <Text>{recording ? "Stop Recording" : "Record"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const recordStyle = StyleSheet.create({
  container: {
    flex: 1,
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

  cardContainer: {
    backgroundColor: "#2C2C2E",
    flex: 1,
    borderRadius: 20,
    padding: 20,
    marginTop: "5%",
    marginBottom: "5%",
    marginVertical: "5%",
    marginHorizontal: "5%",
    elevation: 5,
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 100,
    width: "100%",
    padding: 10,
  },
  buttonContainer: {
    alignItems: "center",
    padding: 5,
    borderRadius: 100,
    elevation: 5,
  },
});
