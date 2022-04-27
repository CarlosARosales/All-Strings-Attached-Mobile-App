// BluetoothScanner does:
// - Access/enable bluetooth module
// - Scan bluetooth devices in the area
// - List the scanned devices
// - Receive data from device
// - Store received data into firebase

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  PermissionsAndroid,
  TouchableOpacity,
  DeviceEventEmitter,
  Switch,
  StyleSheet,
  Alert,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
import base64 from "react-native-base64";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

import styles from "./Styles";

export const manager = new BleManager();

//Service and message UUID are used to specify what characteristics
//the mobile device is looking for

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const MESSAGE_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const MESSAGE_UUID2 = "688091db-1736-4179-b7ce-e42a724a6a68";
//const MESSAGE_UUID3 = "0515e27d-dd91-4f96-9452-5f43649c1819";
//const BOX_UUID = "f27b53ad-c63d-49a0-8c0f-9f297e6cc520";

//Asks for user permission to enable BLE
const requestPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: "Request for Location Permission",
      message: "Bluetooth Scanner requires access to Fine Location Permission",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

//Used for connecting to device and monitoring characteristics
const BluetoothScanner = () => {
  const [logData, setLogData] = useState([]);
  const [logCount, setLogCount] = useState(0);
  const [scannedDevices, setScannedDevices] = useState({});
  const [deviceCount, setDeviceCount] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showBox, setShowBox] = useState(true);

  const toggleSwitch = async () => {
    const btState = await manager.state();
    // test is bluetooth is supported
    if (btState === "Unsupported") {
      alert("Bluetooth is not supported");
      return false;
    }
    // enable if it is not powered on
    if (btState !== "PoweredOn") {
      await manager.enable();
      console.log("enabled");
    } else {
      await manager.disable();
    }

    setIsEnabled((previousState) => !previousState);

    return true;
  };

  //const [message, setMessage] = useState("Nothing Yet");
  //const [boxvalue, setBoxValue] = useState(false);

  const showConfirmDialog = (item) => {
    console.log("hello");
    console.log(item);

    return Alert.alert(
      item,
      " Connected",

      [
        // The "Close" button
        {
          text: "Close",
          onPress: () => {
            setShowBox(false);
          },
        },
      ]
    );
  };

  useEffect(() => {
    manager.onStateChange((state) => {
      const subscription = manager.onStateChange(async (state) => {
        console.log(state);
        const newLogData = logData;
        newLogData.push(state);
        await setLogCount(newLogData.length);
        await setLogData(newLogData);
        subscription.remove();
      }, true);
      return () => subscription.remove();
    });
  }, [manager]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flex: 1, padding: 10 }}>
        <View style={bleStyle.bleContainer}>
          <View style={bleStyle.BluetoothSwitchContainer}>
            <Text style={bleStyle.bleTitleText}>Bluetooth</Text>

            <View style={bleStyle.switchContainer}>
              <Switch
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                trackColor={{ false: "#767577", true: "green" }}
                thumbColor={isEnabled ? "white" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>
          <TouchableOpacity
            style={bleStyle.buttonStyle}
            onPress={async () => {
              const btState = await manager.state();
              console.log("connecting");

              // test if bluetooth is powered on
              if (btState !== "PoweredOn") {
                alert("Bluetooth is not powered on");
                return false;
              }
              // explicitly ask for user's permission
              const permission = await requestPermission();
              if (permission) {
                manager.startDeviceScan(null, null, async (error, device) => {
                  // error handling
                  if (error) {
                    console.log(error);
                    return;
                  }

                  console.log("starting scan");
                  // found a bluetooth device
                  //device.name can be used to limit what device can be connected
                  if (device.name === "Strings attached") {
                    console.log(`${device.name} (${device.id})}`);

                    // Stop scanning as it's not necessary if you are scanning for one device.
                    manager.stopDeviceScan();

                    device
                      .connect()
                      .then((device) => {
                        console.log("device connected");

                        showConfirmDialog(device.name);

                        console.log(device.name);
                        return device.discoverAllServicesAndCharacteristics();
                      })

                      .then((device) => {
                        // Do work on device with services and characteristics
                        console.log("Services and characteristics discovered");

                        var currentDate = new Date();
                        console.log(currentDate);

                        var formatted = new Date("2016-02-29T07:00:00.000Z");
                        console.log(formatted);

                        //Monitors for any messages sent by device via BLE

                        var year = "";
                        var month = "";
                        var day = "";
                        var hour = "";
                        var minutes = "";
                        var seconds = "";

                        let currentTimeESP = new Date();

                        //Gets current time logged by device
                        //format: yyyymmddhhmmss

                        device.monitorCharacteristicForService(
                          SERVICE_UUID,
                          MESSAGE_UUID2,

                          (error, characteristic) => {
                            if (characteristic?.value != null) {
                              //Stores data sent from the device into firebase

                              var timestamp = base64.decode(
                                characteristic?.value
                              );

                              year = timestamp.substring(0, 4);
                              month = timestamp.substring(4, 6);
                              day = timestamp.substring(6, 8);
                              hour = timestamp.substring(8, 10);
                              minutes = timestamp.substring(10, 12);
                              seconds = timestamp.substring(12, 14);

                              currentTimeESP = new Date(
                                year,
                                month - 1,
                                day,
                                hour,
                                minutes,
                                seconds
                              );
                              console.log(currentTimeESP);
                              console.log(
                                "time difference",
                                currentDate - currentTimeESP
                              );

                              console.log(
                                "Current timestamp: ",
                                base64.decode(characteristic?.value),
                                year,
                                month,
                                day,
                                hour,
                                minutes,
                                seconds
                              );
                            }
                          }
                        );

                        console.log(currentTimeESP);

                        device.monitorCharacteristicForService(
                          SERVICE_UUID,
                          MESSAGE_UUID,

                          (error, characteristic) => {
                            if (characteristic?.value != null) {
                              var startTime = base64.decode(
                                characteristic?.value
                              );
                              startTime = startTime.substring(0, 14);

                              year = startTime.substring(0, 4);
                              month = startTime.substring(4, 6);
                              day = startTime.substring(6, 8);
                              hour = startTime.substring(8, 10);
                              minutes = startTime.substring(10, 12);
                              seconds = startTime.substring(12, 14);

                              let currentTimeSession = new Date(
                                year,
                                month - 1,
                                day,
                                hour,
                                minutes,
                                seconds
                              );

                              console.log(
                                "timeStamp to date",
                                currentTimeSession
                              );

                              let timeDifference =
                                currentTimeESP - currentTimeSession;

                              console.log(
                                "Time Difference in ms = ",
                                timeDifference
                              );

                              let convertedDate = new Date(
                                currentDate - timeDifference
                              );

                              console.log("Converted Date: ", convertedDate);

                              var elapsedTime = base64.decode(
                                characteristic?.value
                              );
                              elapsedTime = elapsedTime.substring(14, 20);
                              console.log(elapsedTime);

                              //Stores data sent from the device into firebase
                              firebase
                                .firestore()
                                .collection("rawTimeStamp")
                                .doc(firebase.auth().currentUser.uid)
                                .collection("rawTime")
                                .add({
                                  startTime: convertedDate,
                                  elapsedTime: elapsedTime,
                                  timeSaved:
                                    firebase.firestore.FieldValue.serverTimestamp(),
                                })
                                .then(function () {
                                  console.log("Saved to DB");
                                });

                              console.log(
                                "Message update received: ",
                                base64.decode(characteristic?.value)
                              );
                            }
                          },
                          "messagetransaction"
                        );

                        return device
                          .readCharacteristicForService(
                            SERVICE_UUID,
                            MESSAGE_UUID
                          )
                          .then((valenc) => {
                            console.log("starting");
                            //setMessage(base64.decode(valenc?.value));

                            console.log(base64.decode(valenc?.value));
                            console.log("done");
                          });
                      });

                    //Used to monitor how many devices were scanned by application
                    const newScannedDevices = scannedDevices;
                    newScannedDevices[device.id] = device;
                    await setDeviceCount(Object.keys(newScannedDevices).length);
                    await setScannedDevices(scannedDevices);
                  }
                });
              }
              return true;
            }}
          >
            <Text>Scan Devices</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 2, padding: 10, backgroundColor: "black" }}>
        <Text style={{ fontWeight: "bold", color: "white" }}>
          My Devices ({deviceCount})
        </Text>
        <FlatList
          data={Object.values(scannedDevices)}
          renderItem={({ item }) => {
            return (
              <Text
                style={{ color: "white" }}
              >{`${item.name} (${item.id})`}</Text>
            );
          }}
        />
      </View>
    </View>
  );
};

export default BluetoothScanner;

const bleStyle = StyleSheet.create({
  buttonStyle: {
    width: "40%",
    height: "40%",
    marginTop: "8%",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "white",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  titleSessions: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  bleTitleText: {
    color: "white",
  },
  bleContainer: {
    borderRadius: 15,
    height: "50%",
    padding: "5%",
    backgroundColor: "#2C2C2E",

    alignContent: "center",
    alignItems: "center",
    marginTop: "2%",
  },
  BluetoothSwitchContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  switchContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
});
