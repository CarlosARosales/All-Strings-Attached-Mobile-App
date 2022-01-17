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
          <Text style={styles.topBarText}>Account Settings</Text>
        </View>
      </View>
      <View style={styles.accountContainer}>
        <View style={styles.accountInfoContainer}>
          <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
