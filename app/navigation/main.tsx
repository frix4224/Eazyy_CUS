// accbak/laundry-day-dream/accbak-laundry-day-dream-e7edca62d8a70de63bff20cfe46310379eaa1ad5/app/navigation/main.tsx
import React, { useEffect } from "react";
import { PermissionsAndroid, Platform, StyleSheet } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MAIN_NAV_STRINGS } from "./constants";
import {
  AddAddress,
  CartScreen,
  Checkout,
  FAQ,
  IntroScreen,
  OrderDetails,
  OrderSuccess,
  PasswordReset,
  Payment,
  PickAndCollectScreen,
  SplashScreen,
  CustomQuoteRequestScreen, // Import new screen
} from "../screens";
import { ToastProvider } from "react-native-toast-notifications";
import { COLORS, SIZING } from "../utils";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import IonIcons from "react-native-vector-icons/Ionicons";
import { navigationRef } from "../../App";
import TabStack from "./tabs";
import AuthStack from "./auth";
import { getSecureInfo, setSecureInfo } from "../utils/secureStore";
import { SECURE_STRINGS } from "../utils/secureStore/strings";
import { useSetAtom } from "jotai";
import { userAtom } from "../store/auth";
import { UserInfo } from "../customTypes/userInfo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import messaging from "@react-native-firebase/messaging";
import { fcmTokeAtom } from "../store";
import PushNotification from "react-native-push-notification";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const Main = () => {
  const setUserInfo = useSetAtom(userAtom);
  const setFcmToken = useSetAtom(fcmTokeAtom);

  useEffect(() => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
        setFcmToken(token.token);
      },

      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        if (notification.foreground) {
          PushNotification.localNotification(notification);
        }
      },

      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
      },

      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Eazyy Notification Permissions",
            message: "Eazyy wants to send you notifications",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // const token = await messaging().getToken();
          // console.log({ token });
          // setFcmToken(token);
        } else {
          // console.log('Notifications permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // const token = await messaging().getToken();
        // setFcmToken(token);
      }
    }
  };

  const fetchUserData = async () => {
    requestNotificationPermission();
    const userStorageData = await getSecureInfo(SECURE_STRINGS.USER_INFO);
    if (userStorageData && userStorageData.length > 0) {
      const parsedUserInfo: UserInfo = JSON.parse(userStorageData);
      setUserInfo(parsedUserInfo);
      setTimeout(() => {
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
      }, 5000);
    } else {
      const isFirstTime = await getSecureInfo(SECURE_STRINGS.IS_FIRST_TIME);
      if (isFirstTime && isFirstTime === "false") {
        setTimeout(() => {
          if (Platform.OS === "ios") {
            navigationRef.navigate(MAIN_NAV_STRINGS.AUTHSTACK as never);
          } else {
            navigationRef.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: MAIN_NAV_STRINGS.AUTHSTACK }],
              })
            );
          }
        }, 4000);
      } else {
        await setSecureInfo(SECURE_STRINGS.IS_FIRST_TIME, "false");
        setTimeout(() => {
          if (Platform.OS === "ios") {
            navigationRef.navigate(MAIN_NAV_STRINGS.INTRO as never);
          } else {
            navigationRef.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: MAIN_NAV_STRINGS.INTRO }],
              })
            );
          }
        }, 4000);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <ToastProvider
          placement="top"
          duration={3000}
          animationType="slide-in"
          animationDuration={250}
          successColor={COLORS.PRICE}
          dangerColor={COLORS.RED}
          warningColor={COLORS.WARNING}
          normalColor={"#424242"}
          dangerIcon={
            <MaterialIcons
              size={SIZING.scaleWidth(5)}
              name="dangerous"
              color={COLORS.WHITE}
            />
          }
          successIcon={
            <IonIcons
              size={SIZING.scaleWidth(5)}
              name="checkmark-done"
              color={COLORS.WHITE}
            />
          }
          warningIcon={
            <IonIcons
              size={SIZING.scaleWidth(5)}
              name="warning-outline"
              color={COLORS.WHITE}
            />
          }
          textStyle={{
            fontSize: SIZING.scaleFont(4),
            paddingHorizontal: SIZING.scaleWidth(5),
          }}
          offsetTop={SIZING.scaleHeight(7)}
          swipeEnabled={true}
          style={{ marginTop: SIZING.scaleHeight(6) }}
        >
          <Stack.Navigator
            screenOptions={{ headerShown: false, orientation: "portrait" }}
          >
            <Stack.Screen
              name={MAIN_NAV_STRINGS.SPLASH}
              component={SplashScreen}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.INTRO}
              component={IntroScreen}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.AUTHSTACK}
              component={AuthStack}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.MAINSTACK}
              component={TabStack}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.CART_SCREEN}
              component={CartScreen}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.PICK_COLLECT_SCREEN}
              component={PickAndCollectScreen}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.CHECKOUT}
              component={Checkout}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.ORDER_SUCCESS}
              component={OrderSuccess}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.ORDER_DETAILS}
              component={OrderDetails}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.ADD_ADDRESS}
              component={AddAddress}
            />
            <Stack.Screen name={MAIN_NAV_STRINGS.FAQ} component={FAQ} />
            <Stack.Screen name={MAIN_NAV_STRINGS.PAYMENT} component={Payment} />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.PASSWORD_RESET}
              component={PasswordReset}
            />
            <Stack.Screen
              name={MAIN_NAV_STRINGS.CUSTOM_QUOTE_REQUEST} // New route
              component={CustomQuoteRequestScreen}
            />
          </Stack.Navigator>
        </ToastProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default Main;

const styles = StyleSheet.create({
  gestureContainer: { flex: 1 },
});