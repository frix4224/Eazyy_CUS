import { ParamListBase, RouteProp } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { IMAGES } from "../../assets/images";
import { TAB_STRINGS } from "../constants";

export const TabBarIcons = ({
  route,
  focused,
  color,
}: {
  route: RouteProp<ParamListBase, string>;
  focused: boolean;
  color: string;
}) => {
  if (route.name === TAB_STRINGS.HOME) {
    return (
      <Image
        source={
          focused ? IMAGES.TAB_HOMESCREEN_FILL_ICON : IMAGES.TAB_HOMESCREEN_ICON
        }
        style={styles.imgStyles}
      />
    );
  } else if (route.name === TAB_STRINGS.PRICE) {
    return (
      <Image
        source={focused ? IMAGES.TAB_ACCOUNT_FILL_ICON : IMAGES.TAB_USER_ICON}
        style={styles.imgStyles}
      />
    );
  } else if (route.name === TAB_STRINGS.ORDER) {
    return (
      <Image
        source={focused ? IMAGES.TAB_ORDERS_FILL_ICON : IMAGES.TAB_ORDERS_ICON}
        style={styles.imgStyles}
      />
    );
  } else if (route.name === TAB_STRINGS.ACCOUNT) {
    return (
      <Image
        source={
          focused ? IMAGES.TAB_FAVOURTIES_FILL_ICON : IMAGES.TAB_FAVOURTIES_ICON
        }
        style={styles.imgStyles}
      />
    );
  }
};

const styles = StyleSheet.create({
  imgStyles: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
