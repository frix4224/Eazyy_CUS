import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { COLORS, showCustomToast, SIZING } from "../../utils";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
// import { AccessToken, LoginManager } from "react-native-fbsdk-next";
// import auth from "@react-native-firebase/auth";
import { FONTS } from "../../assets/fonts";
import { IMAGES } from "../../assets/images";
import { AuthButton, AuthField, SocialButtons } from "./common";
import { userSignup, userSocialSignup } from "../../services/methods";
import { CommonActions } from "@react-navigation/native";
import { MAIN_NAV_STRINGS } from "../../navigation/constants";
import { setSecureInfo } from "../../utils/secureStore";
import { SECURE_STRINGS } from "../../utils/secureStore/strings";
import { UserInfo } from "../../customTypes/userInfo";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom } from "../../store/auth";
import { useFormik } from "formik";
import { SignupSchema } from "../../schema/auth";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ErrorText } from "../../components";
import { SignupRequest, SocialSignupRequest } from "../../services/types/auth";
import { navigationRef } from "../../../App";
import { getUniqueId } from "react-native-device-info";
import { GOOGLE_CLIENT_ID } from "@env";
import { fcmTokeAtom } from "../../store";

const Signup = ({
  setAuthType,
}: {
  setAuthType: React.Dispatch<React.SetStateAction<0 | 1>>;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [showGoogleLoading, setShowGoogleLoading] = useState<boolean>(false);
  const setUserInfo = useSetAtom(userAtom);
  const fcmToken = useAtomValue(fcmTokeAtom);

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
  } = useFormik({
    initialValues: { email: "", password: "", fullName: "" },
    onSubmit: async () => {
      setShowLoading(true);
      const UniqueId = await getUniqueId();
      try {
        const payload: SignupRequest = {
          email: values.email,
          password: values.password,
          name: values.fullName,
          device_id: UniqueId,
          device_os: Platform.OS,
          fcm_token: fcmToken,
          type: "custom",
        };
        const signupResponse = await userSignup(payload);

        if (signupResponse.status === 200 && signupResponse.data.status) {
          const data: UserInfo = {
            email: signupResponse.data.data.user.email,
            userId: signupResponse.data.data.user.id,
            name: signupResponse.data.data.user.name,
            token: signupResponse.data.data.access_token,
            userIdentifier: signupResponse.data.data.user.user_identifier,
            mobile: signupResponse.data.data.user.mobile,
          };
          setUserInfo(data);
          await setSecureInfo(
            SECURE_STRINGS.ACCESS_TOKEN,
            signupResponse.data.data.access_token
          );
          await setSecureInfo(SECURE_STRINGS.USER_INFO, JSON.stringify(data));
          navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: MAIN_NAV_STRINGS.MAINSTACK }],
            })
          );
        }
        setShowLoading(false);
      } catch (error: any) {
        showCustomToast(JSON.stringify(error), "danger");

        setShowLoading(false);
        console.log({ error: JSON.stringify(error) });
      }
    },
    validationSchema: SignupSchema,
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
    });
  }, []);
  const onPressSignin = async () => {
    setShowGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const UniqueId = await getUniqueId();
      console.log({ googleSignupResponse: JSON.stringify(response) });
      if (isSuccessResponse(response)) {
        const data: SocialSignupRequest = {
          email: response.data?.user.email,
          name: response.data?.user.name as string,
          profile: response.data?.user.photo ?? "",
          provider_token: response.data.idToken as string,
          device_id: UniqueId,
          device_os: Platform.OS,
          fcm_token: fcmToken,
        };
        const socialSignUpResponse = await userSocialSignup(data, "google");
        if (
          socialSignUpResponse.status === 200 &&
          socialSignUpResponse.data.status
        ) {
          const data: UserInfo = {
            email: socialSignUpResponse.data.data.user.email,
            userId: socialSignUpResponse.data.data.user.id,
            name: socialSignUpResponse.data.data.user.name,
            token: socialSignUpResponse.data.data.access_token,
            userIdentifier: socialSignUpResponse.data.data.user.user_identifier,
            mobile: socialSignUpResponse.data.data.user.mobile,
          };
          setUserInfo(data);
          await setSecureInfo(
            SECURE_STRINGS.ACCESS_TOKEN,
            socialSignUpResponse.data.data.access_token
          );
          await setSecureInfo(SECURE_STRINGS.USER_INFO, JSON.stringify(data));
          navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: MAIN_NAV_STRINGS.MAINSTACK }],
            })
          );
        }
      } else {
        setShowGoogleLoading(false);
        // sign in was cancelled by user
      }
      setShowGoogleLoading(false);
    } catch (error: any) {
      console.log({ error: JSON.stringify(error) });
      setShowGoogleLoading(false);
      showCustomToast(error.message, "danger");
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log({ msg: "in progress" });
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log({ msg: "play services not available" });
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };
  // async function onFacebookButtonPress() {
  //   // // Attempt login with permissions
  //   // const result = await LoginManager.logInWithPermissions([
  //   //   "public_profile",
  //   //   "email",
  //   // ]);
  //   // console.log({ result });
  //   // if (result.isCancelled) {
  //   //   throw "User cancelled the login process";
  //   // }
  //   // // Once signed in, get the users AccessToken
  //   // const data = await AccessToken.getCurrentAccessToken();
  //   // console.log({ data });
  //   // if (!data) {
  //   //   throw "Something went wrong obtaining access token";
  //   // }
  //   // // Create a Firebase credential with the AccessToken
  //   // const facebookCredential = auth.FacebookAuthProvider.credential(
  //   //   data.accessToken
  //   // );
  //   // console.log({ facebookCredential });
  //   // // Sign-in the user with the credential
  //   // return auth().signInWithCredential(facebookCredential);
  // }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.initialsText}>Create an account to continue!</Text>
        <View style={styles.fieldWrapper}>
          <AuthField
            placeholder="Full Name"
            fieldProps={{
              returnKeyType: "next",
              value: values.fullName,
              onChangeText: handleChange("fullName"),
              caretHidden: false,
              autoCapitalize: "none",
              autoComplete: "off",
              autoCorrect: false,
              onBlur: () => {
                setFieldTouched("fullName");
              },
            }}
            inputStyles={{
              borderColor: errors.fullName ? COLORS.RED : COLORS.GRAY,
            }}
            img={IMAGES.FULL_NAME}
          />
          <View style={styles.errorContainer}>
            <ErrorText error={errors.fullName} touched={touched.fullName} />
          </View>
          <AuthField
            placeholder="Email"
            fieldProps={{
              returnKeyType: "next",
              keyboardType: "email-address",
              value: values.email,
              onChangeText: handleChange("email"),
              caretHidden: false,
              autoCapitalize: "none",
              autoComplete: "off",
              autoCorrect: false,
              onBlur: () => {
                setFieldTouched("email");
              },
            }}
            inputStyles={{
              borderColor: errors.email ? COLORS.RED : COLORS.GRAY,
            }}
            img={IMAGES.EMAIL}
          />
          <View style={styles.errorContainer}>
            <ErrorText error={errors.email} touched={touched.email} />
          </View>
          <View
            style={[
              styles.fieldContainer,
              { borderColor: errors.password ? COLORS.RED : COLORS.GRAY },
            ]}
          >
            <TextInput
              style={styles.fieldStyles}
              placeholder="Password"
              secureTextEntry={showPassword}
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={() => setFieldTouched("password")}
              caretHidden={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <IonIcons
                name={showPassword ? "eye-outline" : "eye-off-sharp"}
                size={SIZING.scaleWidth(6)}
                color={COLORS.GRAY}
                style={{ marginRight: SIZING.scaleWidth(3) }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.errorContainer}>
            <ErrorText error={errors.password} touched={touched.password} />
          </View>
        </View>
        <AuthButton
          onPress={handleSubmit}
          title="Sign up"
          loading={showLoading}
        />
        <SocialButtons
          // onFacebookButtonPress={onFacebookButtonPress}
          onPressSignin={onPressSignin}
          // facebookLoading={false}
          googleLoading={showGoogleLoading}
        />
        <View style={styles.alreadyContainer}>
          <Text style={styles.alreadyText}>Already have an account?</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setAuthType(1);
            }}
          >
            <Text style={styles.alreadyLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  initialsText: {
    marginTop: SIZING.scaleHeight(3),
    marginLeft: SIZING.scaleWidth(8),
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsLight,
    fontSize: SIZING.scaleFont(2.6),
  },
  fieldWrapper: {
    marginTop: SIZING.scaleHeight(2),
  },
  fieldContainer: {
    alignSelf: "center",
    borderRadius: SIZING.scaleWidth(10),
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    marginTop: SIZING.scaleHeight(3),
    width: SIZING.scaleWidth(86),
    paddingHorizontal: SIZING.scaleWidth(3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  errorContainer: { marginLeft: SIZING.scaleWidth(10) },
  alreadyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SIZING.scaleHeight(3),
  },
  alreadyText: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.5),
    marginRight: SIZING.scaleWidth(2),
    color: COLORS.GRAY,
  },
  alreadyLink: {
    color: COLORS.BLUE_BORDER,
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.5),
    marginRight: SIZING.scaleWidth(2),
  },
});
