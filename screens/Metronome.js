import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./Styles";
import { auth } from "../firebase";

export default function Settings() {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <>
      <View>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Metronome</Text>
        </View>
      </View>
      <View style={styles.accountContainer}></View>
    </>
  );
}

const settingsStyle = StyleSheet.create({
  button: {
    backgroundColor: "white",
    width: "40%",
    borderRadius: 10,
    alignItems: "center",
    height: "30%",
    margin: "3%",
    justifyContent: "center",
  },
  signOutContainer: {
    height: "20%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  emailText: {
    color: "white",
    marginLeft: "10%",
  },
  emailContainter: {
    backgroundColor: "#2C2C2E",
    borderRadius: 5,
    elevation: 5,
    width: "100%",
    height: "50%",
    justifyContent: "center",
  },
  emailNameContainer2: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  emailNameContainer: {
    width: "50%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flexDirection: "row",
    width: "100%",
    height: "20%",
  },
  imageContainer: {
    width: "50%",
    height: "100%",
    backgroundColor: "black",
  },
});
