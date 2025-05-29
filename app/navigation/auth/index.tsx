import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AUTH_STACK_STRINGS } from "../constants";
import AuthController from "../../screens/auth/authController";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={AUTH_STACK_STRINGS.AUTH_CONTROLLER}
        component={AuthController}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
