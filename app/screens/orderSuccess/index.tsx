import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { MAIN_NAV_STRINGS } from "../../navigation/constants";
import { navigationRef } from "../../../App";

const OrderSuccess = ({ route }) => {
  const { orderId } = route.params;
  const navigation = useNavigation();

  const onPressHome = () => {
    if (Platform.OS === "ios") {
      navigationRef.navigate(MAIN_NAV_STRINGS.MAINSTACK as never);
    } else {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: MAIN_NAV_STRINGS.MAINSTACK }],
        })
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated barStyle="default" />
      <View style={styles.successIconContainer}>
        <MaterialIcons
          name="check-circle-outline"
          size={SIZING.scaleWidth(40)}
          color={COLORS.PRICE}
        />
      </View>
      <Text allowFontScaling={false} style={styles.orderSuccessText}>
        Order Placed Successfully!
      </Text>
      <Text allowFontScaling={false} style={styles.orderHeadingText}>
        Congratulations,{"\n"} your order has been placed and your order id is #
        {orderId}
      </Text>
      <TouchableOpacity
        style={styles.buttonContainer}
        activeOpacity={0.5}
        onPress={onPressHome}
      >
        <Text allowFontScaling={false} style={styles.buttonText}>
          go home
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  successIconContainer: {
    alignItems: "center",
    marginTop: SIZING.scaleHeight(10),
  },
  orderSuccessText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(10),
    marginTop: SIZING.scaleHeight(5),
    color: COLORS.BLACK,
    marginBottom: SIZING.scaleHeight(2),
    marginLeft: SIZING.scaleWidth(5),
    textAlign: "center",
  },
  orderHeadingText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(3.8),
    color: COLORS.BLACK,
    textAlign: "center",
    marginHorizontal: SIZING.scaleWidth(5),
    letterSpacing: 1,
  },
  buttonContainer: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZING.scaleWidth(2),
    marginHorizontal: SIZING.scaleWidth(25),
    paddingVertical: SIZING.scaleHeight(2),
    paddingHorizontal: SIZING.scaleWidth(10),
    marginTop: SIZING.scaleHeight(10),
    marginBottom: SIZING.scaleHeight(10),
  },
  buttonText: {
    textAlign: "center",
    color: COLORS.WHITE,
    textTransform: "uppercase",
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4.5),
  },
});
