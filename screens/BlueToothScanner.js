import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  PermissionsAndroid,
  DeviceEventEmitter,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
import base64 from "react-native-base64";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export const manager = new BleManager();

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const MESSAGE_UUID = "c84b5feb-a12f-45bb-a3ff-a6adce24f69e";
const MESSAGE_UUID2 = "2eec8c1a-4bc6-4c3d-ae54-4c498640b4f2";
const MESSAGE_UUID3 = "b50dd1fb-fec7-46b0-8b3f-c34265cd01f1";

//const BOX_UUID = "f27b53ad-c63d-49a0-8c0f-9f297e6cc520";

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

// BlueetoothScanner does:
// - access/enable bluetooth module
// - scan bluetooth devices in the area
// - list the scanned devices
const BluetoothScanner = () => {
  const [logData, setLogData] = useState([]);
  const [logCount, setLogCount] = useState(0);
  const [scannedDevices, setScannedDevices] = useState({});
  const [deviceCount, setDeviceCount] = useState(0);
  var startDate = [];
  const [dateData, setDateData] = useState({});

  //const [message, setMessage] = useState("Nothing Yet");
  //const [boxvalue, setBoxValue] = useState(false);

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
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontWeight: "bold" }}>Bluetooth Log ({logCount})</Text>
        <FlatList
          data={logData}
          renderItem={({ item }) => {
            return <Text>{item}</Text>;
          }}
        />
        <Button
          title="Turn On Bluetooth"
          onPress={async () => {
            const btState = await manager.state();
            // test is bluetooth is supported
            if (btState === "Unsupported") {
              alert("Bluetooth is not supported");
              return false;
            }
            // enable if it is not powered on
            if (btState !== "PoweredOn") {
              await manager.enable();
            } else {
              await manager.disable();
            }
            return true;
          }}
        />
      </View>

      <View style={{ flex: 2, padding: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          Scanned Devices ({deviceCount})
        </Text>
        <FlatList
          data={Object.values(scannedDevices)}
          renderItem={({ item }) => {
            return <Text>{`${item.name} (${item.id})`}</Text>;
          }}
        />
        <Button
          title="Scan Devices"
          onPress={async () => {
            const btState = await manager.state();
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
                // found a bluetooth device
                if (device.name === "Strings attached") {
                  console.log(`${device.name} (${device.id})}`);

                  // Stop scanning as it's not necessary if you are scanning for one device.

                  manager.stopDeviceScan();

                  device
                    .connect()
                    .then((device) => {
                      console.log("device connected");
                      console.log(device.name);
                      return device.discoverAllServicesAndCharacteristics();
                    })

                    .then((device) => {
                      // Do work on device with services and characteristics
                      console.log("Services and characteristics discovered");
                      /*
                      device
                        .writeCharacteristicWithResponseForService(
                          SERVICE_UUID,
                          MESSAGE_UUID,
                          "MDIvMDkvMjAyMg=="
                        )
                        .then((characteristic) => {
                          console.log("characteristic:"); // < ---- never gets called
                          console.log(characteristic);
                        })
                        .catch((error) => {
                          console.log("error");
                          console.log(error);
                        });*/

                      var startTime;
                      var endTime;
                      var counter = 1;

                      device.monitorCharacteristicForService(
                        SERVICE_UUID,
                        MESSAGE_UUID,

                        (error, characteristic) => {
                          if (characteristic?.value != null) {
                            if (counter % 2 == 0) {
                              endTime = base64.decode(characteristic?.value);
                              firebase
                                .firestore()
                                .collection("rawTimeStamp")
                                .doc(firebase.auth().currentUser.uid)
                                .collection("rawTime")
                                .add({
                                  startTime: startTime,
                                  endTime: endTime,
                                })
                                .then(function () {
                                  console.log("Saved to DB");
                                });
                            } else {
                              startTime = base64.decode(characteristic?.value);
                            }

                            counter += 1;

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

                  const newScannedDevices = scannedDevices;
                  newScannedDevices[device.id] = device;
                  await setDeviceCount(Object.keys(newScannedDevices).length);
                  await setScannedDevices(scannedDevices);
                }
              });
            }
            return true;
          }}
        />
      </View>
    </View>
  );
};

export default BluetoothScanner;
