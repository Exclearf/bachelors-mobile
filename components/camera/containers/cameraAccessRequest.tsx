import { Button, StyleSheet, Text, TextBase, View } from "react-native";
import React, { useContext } from "react";
import { AppDimensionsContext } from "@/contexts/appDimensions";

type Props = {};

const PADDING_OF_TOP_PANEL = 53;

const CameraAccessRequest = (props: Props) => {
  const { width } = useContext(AppDimensionsContext);
  return (
    <View style={styles.centeredView}>
      <View
        style={[
          styles.modalView,
          { width: width - PADDING_OF_TOP_PANEL, marginBottom: width * 0.11 },
        ]}
      >
        <Text style={styles.accessHeader}>Allow access to the camera!</Text>
        <View style={styles.buttonContainer}>
          <Button title="Cancel" />
          <Button title="Accept" />
        </View>
      </View>
    </View>
  );
};

export default CameraAccessRequest;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "none",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    height: 200,
    backgroundColor: "rgba(25, 25, 25, 0.9)",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
  },
  accessHeader: {
    color: "white",
    textAlign: "center",
    paddingTop: 20,
    fontSize: 18,
  },
  buttonContainer: {},
});
