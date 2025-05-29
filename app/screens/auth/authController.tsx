import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import Login from "./login";
import Signup from "./signup";

const AuthController = () => {
  const [authType, setAuthType] = useState<0 | 1>(0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headingWrapper}>
          <TouchableOpacity
            style={styles.headingContainer}
            disabled={authType === 0}
            onPress={() => setAuthType(0)}
          >
            <Text
              style={[styles.heading, authType === 1 && styles.inactiveHeading]}
            >
              Sign Up
            </Text>
            {authType === 0 && <View style={styles.headingDivider} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headingContainer}
            activeOpacity={0.5}
            disabled={authType === 1}
            onPress={() => setAuthType(1)}
          >
            <Text
              style={[styles.heading, authType === 0 && styles.inactiveHeading]}
            >
              Sign In
            </Text>
            {authType === 1 && <View style={styles.headingDivider} />}
          </TouchableOpacity>
        </View>
        {authType === 1 ? <Login /> : <Signup setAuthType={setAuthType} />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthController;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  headingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SIZING.scaleWidth(8),
  },
  headingContainer: {
    marginTop: SIZING.scaleHeight(8),
  },
  headingDivider: {
    backgroundColor: COLORS.PRIMARY,
    height: SIZING.scaleHeight(0.5),
    width: SIZING.scaleWidth(28),
    borderRadius: SIZING.scaleWidth(2),
  },
  heading: {
    fontSize: SIZING.scaleFont(7.5),
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsSemiBold,
  },
  inactiveHeading: {
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.GRAY,
  },
});
