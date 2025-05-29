import React from "react";
import { StyleSheet, Text } from "react-native";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";

const ErrorText = ({
  error = "",
  touched = false,
}: {
  error: string | undefined;
  touched: boolean | undefined;
}) => {
  if (typeof error !== "string" || error.length < 1 || !touched) return null;
  return <Text style={styles.label}>{error}</Text>;
};

export default ErrorText;
const styles = StyleSheet.create({
  label: {
    color: COLORS.RED,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(3.2),
    marginTop: SIZING.scaleHeight(1),
  },
});
