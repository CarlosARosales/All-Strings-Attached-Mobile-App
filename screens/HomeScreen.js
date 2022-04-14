import { useNavigation } from "@react-navigation/core";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { Component, FlatList, useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebase";
import Settings from "./Settings";
import Record from "./Record";
import PracticeLog from "./PracticeLog";
import AddInstrument from "./AddInstrument";
import Save from "./Save";
import styles from "./Styles";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/app";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Instruments from "./Instruments";
import { BleManager } from "react-native-ble-plx";
import BluetoothScanner from "./BlueToothScanner";
import Metronome from "./Metronome";
import TunerApp from "./TunerApp";

import {
  fetchUser,
  fetchUserInstruments,
  fetchUserPractice,
  fetchUserRecordings,
} from "../redux/actions/actions/index";
import { render } from "react-dom";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarInactiveBackgroundColor: "#161616",
        tabBarActiveBackgroundColor: "#161616",
      }}
    >
      <Tab.Screen
        name="Instrument Manager"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="violin" color={color} size={size} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clock-time-four-outline"
              color={color}
              size={size}
            />
          ),
        }}
        name="PracticeLog"
        component={PracticeLog}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="metronome"
              color={color}
              size={size}
            />
          ),
        }}
        name="Metronome"
        component={Metronome}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="metronome"
              color={color}
              size={size}
            />
          ),
        }}
        name="Tuner"
        component={TunerApp}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="radiobox-marked"
              color={color}
              size={size}
            />
          ),
        }}
        name="Record"
        component={Record}
      />
      <Tab.Screen
        name="BLE Scanner"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="devices" color={color} size={size} />
          ),
        }}
        component={BluetoothScanner}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account"
              color={"white"}
              size={size}
            />
          ),
        }}
        name="Settings"
        component={Settings}
      />
    </Tab.Navigator>
  );
}

function Test(props) {
  const { currentUser, instruments } = props;

  return (
    <View>
      <Text style={styles.inputText}>Testing</Text>
    </View>
  );
}

function NavigationEnabler(props) {
  const navigation = useNavigation();

  return (
    (<HomeScreen {...props} navigation={navigation} />), (<MyTabs></MyTabs>)
  );
}

class HomeScreen extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Device Manager</Text>
        </View>
        <View style={styles.addInstrumentContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddInstrument")}
            style={styles.buttonAddInstrument}
          >
            <Text style={styles.buttonText}>+ Add instrument</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.buttonText}>Hello {auth.currentUser?.email}</Text>

        <Instruments></Instruments>
      </View>
    );
  }
}

export class Home extends Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.fetchUserInstruments();
    this.props.fetchUserPractice();
    this.props.fetchUserRecordings();
  }

  render() {
    const { currentUser, instruments } = this.props;

    return <NavigationEnabler></NavigationEnabler>;
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  instruments: store.userState.instruments,
  rawTimeStamp: store.userState.rawTimeStamp,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      fetchUser,
      fetchUserInstruments,
      fetchUserPractice,
      fetchUserRecordings,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Home);
