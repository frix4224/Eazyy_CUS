import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";

const FaqItem = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedValue = useState(new Animated.Value(0))[0];
  const text =
    "Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development to fill empty spaces in a layout that d ...................";

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animatedValue, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, text.length * 0.55],
  });

  return (
    <View style={styles.container}>
      <View style={styles.offerItemContainer}>
        <View style={styles.offerItemNameContainer}>
          <Text allowFontScaling={false} style={styles.offerText}>
            How to create a account?
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.5} onPress={toggleDescription}>
          <MaterialCommunityIcons
            name="plus"
            size={SIZING.scaleWidth(6)}
            color={COLORS.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{
          height: heightInterpolation,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: SIZING.scaleHeight(1),
        }}
      >
        <Text
          style={[
            styles.offerDescription,
            { width: isExpanded ? undefined : SIZING.scaleWidth(70) },
          ]}
          ellipsizeMode="tail"
          numberOfLines={isExpanded ? undefined : 1}
        >
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    marginVertical: SIZING.scaleHeight(1),
    marginHorizontal: SIZING.scaleWidth(1),
    borderRadius: SIZING.scaleWidth(2),
    borderColor: COLORS.GRAY,
    borderWidth: 1,
  },
  offerItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SIZING.scaleWidth(3),
    marginVertical: SIZING.scaleHeight(0.5),
  },
  offerItemNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZING.scaleWidth(65),
  },
  offerText: {
    marginLeft: SIZING.scaleWidth(2),
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsBold,
    fontSize: SIZING.scaleFont(3.8),
    opacity: 0.8,
  },
  offerDescription: {
    color: COLORS.GRAY,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(3.6),
    marginHorizontal: SIZING.scaleWidth(5),
  },
});

export default FaqItem;
