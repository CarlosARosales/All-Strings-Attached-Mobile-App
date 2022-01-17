import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./Styles";

export default function PracticeLog() {
  return (
    <>
      <View>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Practice Log</Text>
        </View>
      </View>
      <View style={styles.container}></View>
    </>
  );
}
