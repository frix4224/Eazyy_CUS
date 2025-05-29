import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/services/HomeScreen";
import {
  TAB_ACCOUNT_STACK_STRINGS,
  TAB_HOME_STACK_STRINGS,
  TAB_ORDERS_STACK_STRINGS,
  TAB_PRICING_STACK_STRINGS,
} from "../constants";
import { AccountScreen, EditProfle } from "../../screens";
import OrdersScreen from "../../screens/orders";
import ServiceOverview from "../../screens/services/overview";
import { useSetAtom } from "jotai";
import { tabCartAtom } from "../../store";

const HomeStack = createNativeStackNavigator();
const PricingStack = createNativeStackNavigator();
const OrderStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();

export const HomeScreenStack = () => {
  const setTabCart = useSetAtom(tabCartAtom);
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name={TAB_HOME_STACK_STRINGS.HOME}
        component={HomeScreen}
      />
      <HomeStack.Screen
        name={TAB_HOME_STACK_STRINGS.SERVICE_OVERVIEW}
        component={ServiceOverview}
        listeners={{
          beforeRemove: () => {
            setTabCart("");
          },
        }}
      />
    </HomeStack.Navigator>
  );
};
export const OrderScreenStack = () => {
  return (
    <OrderStack.Navigator screenOptions={{ headerShown: false }}>
      <OrderStack.Screen
        name={TAB_ORDERS_STACK_STRINGS.HOME}
        component={OrdersScreen}
      />
    </OrderStack.Navigator>
  );
};
export const AccountScreenStack = () => {
  return (
    <AccountStack.Navigator screenOptions={{ headerShown: false }}>
      <AccountStack.Screen
        name={TAB_ACCOUNT_STACK_STRINGS.HOME}
        component={AccountScreen}
      />
      <AccountStack.Screen
        name={TAB_ACCOUNT_STACK_STRINGS.EDIT_PROFILE}
        component={EditProfle}
      />
    </AccountStack.Navigator>
  );
};
