import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
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
import { userLogin, userSocialSignup } from "../../services/methods";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { MAIN_NAV_STRINGS } from "../../navigation/constants";
import { setSecureInfo } from "../../utils/secureStore";
import { SECURE_STRINGS } from "../../utils/secureStore/strings";
import { UserInfo } from "../../customTypes/userInfo";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom } from "../../store/auth";
import { useFormik } from "formik";
import { LoginSchema } from "../../schema/auth";
import IonIcons from "react-native-vector-icons/Ionicons";
import { ErrorText } from "../../components";
import { navigationRef } from "../../../App";
import { GOOGLE_CLIENT_ID } from "@env";
import { SocialSignupRequest } from "../../services/types/auth";
import { getUniqueId } from "react-native-device-info";
import { fcmTokeAtom } from "../../store";

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [showGoogleLoading, setShowGoogleLoading] = useState<boolean>(false);
  const setUserInfo = useSetAtom(userAtom);
  const fcmToken = useAtomValue(fcmTokeAtom);

  const navigation = useNavigation();

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async () => {
      setShowLoading(true);
      const UniqueId = await getUniqueId();
      try {
        const loginResponse = await userLogin({
          email: values.email,
          password: values.password,
          device_id: UniqueId,
          device_os: Platform.OS,
          fcm_token: fcmToken,
        });
        console.log({
          email: values.email,
          password: values.password,
          device_id: UniqueId,
          device_os: Platform.OS,
          fcm_token: fcmToken,
        });

        if (loginResponse.status === 200 && loginResponse.data.status) {
          const data: UserInfo = {
            email: loginResponse.data.data.user.email,
            userId: loginResponse.data.data.user.id,
            name: loginResponse.data.data.user.name,
            userIdentifier: loginResponse.data.data.user.user_identifier,
            token: loginResponse.data.data.access_token,
            mobile: loginResponse.data.data.user.mobile,
          };
          setUserInfo(data);
          await setSecureInfo(
            SECURE_STRINGS.ACCESS_TOKEN,
            loginResponse.data.data.access_token
          );
          await setSecureInfo(SECURE_STRINGS.USER_INFO, JSON.stringify(data));
          navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: MAIN_NAV_STRINGS.MAINSTACK }],
            })
          );
        }
      } catch (error: any) {
        showCustomToast(JSON.stringify(error), "danger");
        console.log({ error });
      } finally {
        setShowLoading(false);
      }
    },
    validationSchema: LoginSchema,
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
      if (isSuccessResponse(response)) {
        const data: SocialSignupRequest = {
          email: response.data?.user.email,
          name: response.data?.user.name as string,
          profile: response.data?.user.photo ?? "",
          provider_token: response.data.idToken as string,
          fcm_token: fcmToken,
          device_id: UniqueId,
          device_os: Platform.OS,
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
    } catch (error) {
      setShowGoogleLoading(false);
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
      <Text style={styles.initialsText}>Sign in your account to continue!</Text>
      <View style={styles.fieldWrapper}>
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
        title="Sign in"
        loading={showLoading}
      />
      <SocialButtons
        // onFacebookButtonPress={onFacebookButtonPress}
        onPressSignin={onPressSignin}
        // facebookLoading={false}
        googleLoading={showGoogleLoading}
      />
      <View style={styles.alreadyContainer}>
        <Text style={styles.alreadyText}>Forgot Password?</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            navigation.navigate(MAIN_NAV_STRINGS.PASSWORD_RESET as never)
          }
        >
          <Text style={styles.alreadyLink}>Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

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
