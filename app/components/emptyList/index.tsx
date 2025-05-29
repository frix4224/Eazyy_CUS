import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "../../assets/fonts";
import { COLORS, SIZING } from "../../utils";

const EmptyList = ({ title }: { title?: string }) => {
  const textTitle = title || "No items found";

  return (
    <View style={style.container}>
      <Text style={style.text}>{textTitle}</Text>
    </View>
  );
};
export default EmptyList;

const style = StyleSheet.create({
  container: { alignItems: "center", marginTop: SIZING.scaleHeight(2) },
  text: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(5),
    color: COLORS.BLACK,
  },
});
