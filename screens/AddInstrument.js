import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./Styles";
import { Button } from "react-native-paper";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function AddInstrument({ navigation }) {
  const [instrumentName, setInstrumentName] = useState("");
  const [instrumentModel, setInstrumentModel] = useState("");
  const [year, setYear] = useState("");

  const saveInstrumentData = () => {
    firebase
      .firestore()
      .collection("instruments")
      .doc(firebase.auth().currentUser.uid)
      .collection("userInstruments")
      .add({
        instrumentName,
        instrumentModel,
        year,
      })
      .then(function () {
        navigation.popToTop();
      });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Add Instrument</Text>
        </View>
        <View style={styles.addInstrumentCardContainer}>
          <View style={styles.addInstrumentCard}>
            <View style={styles.imageContainer}></View>

            <View style={styles.inputTextContainer}>
              <View style={styles.instrumentInputContainter}>
                <Text style={styles.secondaryText}>Instrument Type</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputTextBox}>
                    <TextInput
                      style={styles.inputBox}
                      placeholder="Instrument "
                      placeholderTextColor="white"
                      onChangeText={(instrumentName) =>
                        setInstrumentName(instrumentName)
                      }
                    ></TextInput>
                  </View>
                </View>
              </View>
              <View style={styles.instrumentInputContainter}>
                <Text style={styles.secondaryText}>Instrument Model</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputTextBox}>
                    <TextInput
                      placeholder="Model"
                      placeholderTextColor="white"
                      onChangeText={(instrumentModel) =>
                        setInstrumentModel(instrumentModel)
                      }
                    ></TextInput>
                  </View>
                </View>
              </View>

              <View style={styles.instrumentInputContainter}>
                <Text style={styles.secondaryText}>Instrument Year</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.inputTextBox}>
                    <TextInput
                      placeholder="Year"
                      placeholderTextColor="white"
                      onChangeText={(year) => setYear(year)}
                    ></TextInput>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={saveInstrumentData}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Add Instrument</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
