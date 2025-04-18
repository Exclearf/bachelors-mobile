import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import Button from "@/features/shared/components/input/Button";
import { AppDimensionsContext } from "@/features/shared/contexts/appDimensions";

type Props = {
    handler: () => void;
};

const PADDING_OF_TOP_PANEL = 53;

const BUTTON_HEIGHT = 45;
const BUTTON_WIDTH = 90;

const CameraAccessRequestModal = ({ handler }: Props) => {
    const { width, height } = useContext(AppDimensionsContext);
    return (
        <View
            style={[
                styles.centeredView,
                { width, height, backgroundColor: "rgba(0,0,0,0.45)" },
            ]}
        >
            <View
                style={[
                    styles.modalView,
                    { width: width - PADDING_OF_TOP_PANEL, marginBottom: width * 0.11 },
                ]}
            >
                <Text style={styles.accessHeader}>Allow access to the camera</Text>
                <Pressable style={styles.buttonContainer} onPress={handler}>
                    <Button
                        width={BUTTON_WIDTH}
                        height={BUTTON_HEIGHT}
                        backgroundColor={"rgba(75,75,75,0.9)"}
                    >
                        <Text style={{ textAlign: "center", color: "white" }}>Allow</Text>
                    </Button>
                </Pressable>
            </View>
        </View>
    );
};

export default CameraAccessRequestModal;

const styles = StyleSheet.create({
    centeredView: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        height: 200,
        backgroundColor: "rgba(50, 50, 50, 0.95)",
        justifyContent: "space-around",
        alignItems: "center",
        borderRadius: 10,
    },
    accessHeader: {
        color: "white",
        textAlign: "center",
        paddingTop: 20,
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
    },
});
