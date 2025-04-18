import { StyleSheet, useWindowDimensions, View } from "react-native";
import React from "react";
import Accordion from "@/features/shared/components/layout/Accordion";

type Props = {};

const Test = (props: Props) => {
    const { height, width } = useWindowDimensions();
    const maxHeight = height - height * 0.19;

    return (
        <View
            style={{
                height: "100%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
            }}
        >
            <Accordion
                translationKey="Test"
                maxHeight={maxHeight * 0.33}
                style={{
                    width,
                }}
            />
        </View>
    );
};

export default Test;

const styles = StyleSheet.create({});
