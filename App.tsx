import * as React from "react";
import Main from "./app/navigation/main";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
if (__DEV__) {
  require("./ReactotronConfig");
}

export const navigationRef = createNavigationContainerRef();
function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Main />
    </NavigationContainer>
  );
}

export default App;
