import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  PermissionsAndroid,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./Styles";
import { Audio } from "expo-av";
import { connect } from "react-redux";

import firebase from "firebase";
import { getStorage, ref, listAll } from "firebase/firebase-storage";

require("firebase/firestore");
require("firebase/firebase-storage");

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

function Record(props) {
  const [recording, setRecording] = React.useState();
  const { currentUser, recordings } = props;

  console.log(currentUser, recordings);
  var reference = `recording/${firebase.auth().currentUser.uid}`;

  const sound = new Audio.Sound();

  async function startPlaying(source) {
    const soundObject = new Audio.Sound();

    console.log(source);
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: source });

      await sound.playAsync();
    } catch (e) {
      console.warn(e);
    }
  }

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
    console.log("asdasdasdasd");
    console.log(uri);

    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          try {
            resolve(xhr.response);
          } catch (error) {
            console.log("error:", error);
          }
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      if (blob != null) {
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        const task = firebase
          .storage()
          .ref()
          .child(
            `recording/${
              firebase.auth().currentUser.uid
            }/${Math.random().toString(36)}.${fileType}`
          )
          .put(blob, {
            contentType: `audio/${fileType}`,
          });
        const taskProgress = (snapshot) => {
          console.log(`transferred: ${snapshot.bytesTransferred}`);
        };

        const taskCompleted = (snaphot) => {
          task.snapshot.ref.getDownloadURL().then((snapshot) => {
            saveAudioData(snapshot);
            console.log(snapshot);
          });
        };

        const taskError = (snapshot) => {
          console.log(snapshot);
        };

        task.on("state_changed", taskProgress, taskError, taskCompleted);
      } else {
        console.log("erroor with blob");
      }
    } catch (error) {
      console.log("error:", error);
    }

    // task.on("state_changed", taskProgress, taskError, taskCompleted);

    console.log("Recording stopped and stored at", uri);
  }

  const saveAudioData = (downloadURL) => {
    firebase
      .firestore()
      .collection("audioFiles")
      .doc(firebase.auth().currentUser.uid)
      .collection("userAudio")
      .add({
        downloadURL,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        console.log("Success!");
      });
  };

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
                  <MaterialCommunityIcons
                    name="radiobox-marked"
                    color="white"
                    size={200}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <View>
                  <FlatList
                    horizontal={false}
                    data={recordings}
                    renderItem={({ item }) => (
                      <View>
                        <View style={recordStyle.playButtonContainer}>
                          <Text style={recordStyle.otherText}>Date: </Text>
                          <View style={recordStyle.playerContainer}>
                            <TouchableOpacity
                              style={recordStyle.playButtonStyle}
                              onPress={() => startPlaying(item.downloadURL)}
                            >
                              <MaterialCommunityIcons
                                name="play"
                                color={"white"}
                                size={32}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                  ></FlatList>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  instruments: store.userState.instruments,
  rawTimeStamp: store.userState.rawTimeStamp,
  recordings: store.userState.recordings,
});

export default connect(mapStateToProps, null)(Record);

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

    width: "100%",
  },
  playButtonContainer: {
    flexDirection: "row",

    padding: 5,
  },
  playerContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  playButtonStyle: {
    alignItems: "center",

    width: "20%",
  },
  buttonContainer: {
    alignItems: "center",
    padding: 5,
    borderRadius: 100,
  },
});
