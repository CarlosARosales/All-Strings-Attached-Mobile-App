import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./Styles";
import firestore from "@react-native-firebase/firestore";
import { UsersRef } from "../firebase";

const DeviceManager = () => {
  return (
    <>
      <View>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Device Manager</Text>
        </View>
      </View>
      <View style={styles.container}></View>
    </>
  );
};

export default DeviceManager;
