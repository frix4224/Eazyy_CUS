import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  ImageSourcePropType,
  ActivityIndicator,
  StyleProp,
  TextStyle,
} from "react-native";
import { IMAGES } from "../../assets/images";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";

export const SocialButtons = ({
  onPressSignin,
  // onFacebookButtonPress,
  googleLoading,
}: // facebookLoading,
{
  onPressSignin: () => void;
  // onFacebookButtonPress: () => void;
  googleLoading: boolean;
  // facebookLoading: boolean;
}) => {
  return (
    <View style={styles.socialBtnContainer}>
      <TouchableOpacity
        style={styles.googleBtnContainer}
        onPress={onPressSignin}
        disabled={googleLoading}
      >
        <Image source={IMAGES.GOOGLE_ICON} style={styles.socialIcon} />
        <Text style={styles.googleBtnText}>Continue with Google</Text>
        {googleLoading && (
          <ActivityIndicator
            size={"large"}
            color={COLORS.PRIMARY}
            style={{ marginLeft: SIZING.scaleWidth(2) }}
          />
        )}
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={[
          styles.googleBtnContainer,
          { marginTop: SIZING.scaleHeight(4) },
        ]}
        onPress={onFacebookButtonPress}
        disabled={facebookLoading}
      >
        <Image source={IMAGES.FACEBOOK_ICON} style={styles.socialIcon} />
        <Text style={styles.googleBtnText}>Continue with Facebook</Text>
        {facebookLoading && (
          <ActivityIndicator
            size={"large"}
            color={COLORS.PRIMARY}
            style={{ marginLeft: SIZING.scaleWidth(2) }}
          />
        )}
      </TouchableOpacity> */}
    </View>
  );
};

export const AuthButton = ({
  onPress,
  title,
  loading,
}: {
  onPress: () => void;
  title: string;
  loading: boolean;
}) => {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      activeOpacity={0.5}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.WHITE} size={"small"} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export const AuthField = ({
  placeholder,
  fieldProps,
  img,
  inputStyles,
}: {
  ref?: React.RefObject<TextInput>;
  placeholder: string;
  fieldProps?: TextInputProps;
  img?: ImageSourcePropType;
  inputStyles?: StyleProp<TextStyle>;
}) => {
  return (
    <View style={[styles.fieldContainer, inputStyles]}>
      <TextInput
        style={styles.fieldStyles}
        placeholder={placeholder}
        {...fieldProps}
      />
      {img && <Image source={img} style={styles.inputImg} />}
    </View>
  );
};

const styles = StyleSheet.create({
  socialBtnContainer: {
    alignItems: "center",
    marginTop: SIZING.scaleHeight(7),
  },
  googleBtnContainer: {
    paddingVertical: SIZING.scaleHeight(0.8),
    borderWidth: SIZING.scaleWidth(0.2),
    borderColor: COLORS.GRAY,
    backgroundColor: COLORS.WHITE,
    width: SIZING.scaleWidth(80),
    borderRadius: SIZING.scaleWidth(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtnText: {
    color: COLORS.BLACK,
    textAlign: "center",
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: SIZING.scaleFont(3.5),
    marginTop: SIZING.scaleHeight(0.5),
  },
  socialIcon: {
    width: SIZING.scaleWidth(10),
    height: SIZING.scaleHeight(5),
    resizeMode: "contain",
    marginRight: SIZING.scaleWidth(2),
  },
  buttonContainer: {
    marginTop: SIZING.scaleHeight(5),
    backgroundColor: COLORS.PRIMARY,
    width: SIZING.scaleWidth(50),
    paddingVertical: SIZING.scaleHeight(2),
    alignSelf: "center",
    borderRadius: SIZING.scaleWidth(10),
  },
  buttonText: {
    color: COLORS.WHITE,
    textAlign: "center",
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
  },
  fieldContainer: {
    borderRadius: SIZING.scaleWidth(10),
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    marginTop: SIZING.scaleHeight(3),
    width: SIZING.scaleWidth(86),
    paddingHorizontal: SIZING.scaleWidth(3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
  },
  fieldStyles: {
    paddingVertical: SIZING.scaleHeight(1.5),
    fontSize: SIZING.scaleFont(3.5),
    fontFamily: FONTS.PoppinsRegular,
    width: SIZING.scaleWidth(72),
  },
  inputImg: {
    width: SIZING.scaleWidth(5),
    height: SIZING.scaleHeight(5),
    resizeMode: "contain",
    marginTop: SIZING.scaleHeight(0.5),
    marginRight: SIZING.scaleWidth(2),
  },
});
