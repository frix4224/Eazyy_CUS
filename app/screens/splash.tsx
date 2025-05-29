import React from "react";
import { View, StyleSheet } from "react-native";
import { SIZING } from "../utils";
import { IMAGES } from "../assets/images";
import FastImage from "react-native-fast-image";

const Splash = () => {
  return (
    <View style={styles.container}>
      <FastImage style={styles.img} source={IMAGES.SPLASH_ANIMATION} />
    </View>
  );
};
export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: { width: SIZING.scaleWidth(100), height: SIZING.scaleHeight(100) },
});
