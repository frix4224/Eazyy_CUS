import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { TabBarIcons } from "./tabIcons";
import { COLORS } from "../../utils";
import { TAB_STRINGS } from "../constants";
import {
  OrderScreenStack,
  HomeScreenStack,
  AccountScreenStack,
} from "./tabStack";
import CustomTabBar from "./customTabBar";
import ServiceOverview from "../../screens/services/overview";

const Tab = createBottomTabNavigator();

const renderTabBarIcon =
  ({ route }: { route: RouteProp<ParamListBase, string> }) =>
  ({ color, focused }: { color: string; focused: boolean }) =>
    <TabBarIcons route={route} focused={focused} color={color} />;

export default function App({ navigation }: any) {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar props={props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarIcon: renderTabBarIcon({ route }),
        tabBarActiveBackgroundColor: COLORS.PRIMARY,
        tabBarInactiveBackgroundColor: COLORS.PRIMARY,
      })}
    >
      <Tab.Screen name={TAB_STRINGS.HOME} component={HomeScreenStack} />
      <Tab.Screen name={TAB_STRINGS.PRICE} component={ServiceOverview} />
      <Tab.Screen name={TAB_STRINGS.ORDER} component={OrderScreenStack} />
      <Tab.Screen name={TAB_STRINGS.ACCOUNT} component={AccountScreenStack} />
    </Tab.Navigator>
  );
}
