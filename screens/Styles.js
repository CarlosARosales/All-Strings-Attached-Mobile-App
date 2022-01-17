import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
  },
  addInstrumentContainer: {
    marginTop: "10%",
    alignItems: "flex-end",
  },
  buttonAddInstrument: {
    backgroundColor: "#0782F9",
    width: "30%",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginRight: 10,
    elevation: 5,
  },
  addInstrumentCardContainer: {
    justifyContent: "center",
    height: "70%",
    marginTop: "10%",
    alignItems: "center",
  },
  addInstrumentCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    height: "100%",
    width: "70%",
    alignItems: "center",
    elevation: 30,
  },
  imageContainer: {
    backgroundColor: "black",
    marginTop: "10%",
    width: "70%",
    height: "50%",
    borderRadius: 10,
    elevation: 5,
  },
  accountContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  containerGallery: {
    flex: 1,
  },
  accountInfoContainer: {
    backgroundColor: "white",
    height: "30%",
  },
  inputText: {
    color: "white",
    marginTop: "5%",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  topBar: {
    alignSelf: "stretch",
    height: 52,
    flexDirection: "row", // row
    backgroundColor: "#161616",
    alignItems: "center",
    justifyContent: "center", // center, space-around
    paddingLeft: 10,
    paddingRight: 10,
  },
  topBarText: {
    color: "white",
  },
  inputTextContainer: {
    marginTop: "10%",
    width: "70%",
    height: "20%",
  },
  secondaryText: {
    marginTop: "1%",
    color: "rgba(235, 235, 245, 0.6)",
  },
  instrumentInputContainter: {
    flexDirection: "row",
  },
  inputContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  primaryColor: {
    marginLeft: "10%",
    color: "white",
  },
  inputTextBox: {
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    elevation: 5,
    width: "80%",
    backgroundColor: "rgba(118, 118, 128, 0.6)",
  },
});
