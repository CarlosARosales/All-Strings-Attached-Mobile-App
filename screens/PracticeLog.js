import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import { Dimensions } from "react-native";

import styles from "./Styles";
import firestore from "@react-native-firebase/firestore";
import { List } from "react-native-paper";
import { connect } from "react-redux";

function PracticeLog(props) {
  const { currentUser, instruments, rawTimeStamp } = props;
  console.log(currentUser, instruments, rawTimeStamp);

  const screenWidth = Dimensions.get("window").width;

  const data = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 100, 43],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "black",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "black",
    backgroundGradientToOpacity: 10,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <>
      <View>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Practice Log</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={instrumentStyles.containerGallery}>
          <View style={instrumentStyles.dataContainer}>
            <View style={instrumentStyles.barGraphContainer}>
              <BarChart
                data={data}
                width={500}
                height={220}
                yAxisLabel=""
                chartConfig={chartConfig}
              />
            </View>

            <FlatList
              horizontal={false}
              data={rawTimeStamp}
              renderItem={({ item }) => (
                <View style={instrumentStyles.instrumentCard}>
                  <View>
                    <View>
                      <Text style={instrumentStyles.title}>Session 1</Text>
                      <View style={instrumentStyles.deleteInstrumentContainer}>
                        <View>
                          <Text style={instrumentStyles.otherText}>
                            {item.startTime
                              .toDate()
                              .toString()
                              .substring(0, 24)}
                          </Text>
                        </View>
                        <View style={instrumentStyles.deleteButtonContainer}>
                          <Text style={instrumentStyles.otherText}>
                            Time: {item.elapsedTime.substring(0, 2)}:
                            {item.elapsedTime.substring(2, 4)}:
                            {item.elapsedTime.substring(4, 6)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={instrumentStyles.bottomLine}></View>
                </View>
              )}
            ></FlatList>
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
});

const instrumentStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  barGraphContainer: {
    marginTop: "2%",
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
    fontSize: 14,
  },
  containerGallery: {
    flex: 1,
  },
  instrumentCard: {
    backgroundColor: "#2C2C2E",
    marginVertical: "5%",
    marginHorizontal: "5%",
  },
  deleteInstrumentContainer: {
    flexDirection: "row",
    marginTop: "2.5%",
    flex: 1,
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
  dataContainer: {
    flex: 1,
    marginTop: "5%",
    marginBottom: "5%",
    borderRadius: 20,
    padding: 0,
    marginVertical: "5%",
    justifyContent: "center",
    marginHorizontal: "5%",

    backgroundColor: "#2C2C2E",
  },
  bottomLine: {
    borderBottomColor: "rgba(235, 235, 245, 0.6)",
    borderBottomWidth: 1,
    marginTop: "5%",
  },
});

export default connect(mapStateToProps, null)(PracticeLog);
