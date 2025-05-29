import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import { ActivityIndicator } from "react-native-paper";

const OrderButton = ({
  title,
  onPress,
  loading,
  disabled,
}: {
  title: string;
  onPress: () => void;
  loading: boolean;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled}
      style={[styles.container, { opacity: disabled ? 0.6 : 1 }]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.WHITE} size={"small"} />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
export default OrderButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SIZING.scaleHeight(2),
    marginHorizontal: SIZING.scaleWidth(5),
    marginBottom: SIZING.scaleHeight(2),
    alignItems: "center",
    borderRadius: SIZING.scaleWidth(2),
  },
  title: {
    color: COLORS.WHITE,
    fontSize: SIZING.scaleFont(4),
    textTransform: "uppercase",
    fontFamily: FONTS.PoppinsRegular,
  },
});
