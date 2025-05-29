import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { COLORS, SIZING } from "../utils";
import { FONTS } from "../assets/fonts";

const FullScreenLoader = ({
  isLoading = false,
  text = "",
}: {
  isLoading: boolean;
  text?: string;
}) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <ActivityIndicator color={COLORS.WHITE} size={"large"} />
        {!!text && (
          <Text style={styles.textStyles} allowFontScaling={false}>
            {text}
          </Text>
        )}
      </View>
    </View>
  );
};
export default FullScreenLoader;
const styles = StyleSheet.create({
  centeredView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    height: SIZING.scaleHeight(100),
  },
  modalView: {},
  textStyles: {
    color: COLORS.WHITE,
    textAlign: "center",
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4.5),
    letterSpacing: 1,
  },
});
