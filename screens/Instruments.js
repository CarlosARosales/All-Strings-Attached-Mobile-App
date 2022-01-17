import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./Styles";
import firestore from "@react-native-firebase/firestore";
import { List } from "react-native-paper";
import { connect } from "react-redux";

function Instruments(props) {
  const { currentUser, instruments } = props;

  console.log(currentUser, instruments);
  return (
    <View style={instrumentStyles.container}>
      <View style={instrumentStyles.containerGallery}>
        <FlatList
          horizontal={false}
          data={instruments}
          renderItem={({ item }) => (
            <View style={instrumentStyles.instrumentCard}>
              <View style={instrumentStyles.deleteInstrumentContainer}>
                <View>
                  <Text style={instrumentStyles.title}>
                    {item.instrumentName}
                  </Text>
                </View>
                <View style={instrumentStyles.deleteButtonContainer}>
                  <TouchableOpacity
                    onPress={() => null}
                    style={instrumentStyles.deleteInstrumentButton}
                  >
                    <Text style={instrumentStyles.buttonText}>
                      - Delete Instrument
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={instrumentStyles.otherText}>
                Model: {item.instrumentModel}
              </Text>
              <Text style={instrumentStyles.otherText}>Year: {item.year}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  instruments: store.userState.instruments,
});

const instrumentStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
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
  instrumentCard: {
    borderRadius: 20,
    backgroundColor: "#2C2C2E",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  deleteInstrumentContainer: {
    flexDirection: "row",
    marginTop: "2.5%",
  },
  deleteButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  deleteInstrumentButton: {
    backgroundColor: "#0782F9",
    width: 150,
    padding: 5,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
  },
});

export default connect(mapStateToProps, null)(Instruments);
