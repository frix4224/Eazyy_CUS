import React from "react";
import { View } from "react-native";
import { IMAGE_BASE_URL } from "@env";
import WebView from "react-native-webview";

const Payment = () => {
  const checkout_url: string = `${IMAGE_BASE_URL}password/reset`;

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: checkout_url }} minimumFontSize={14} />
    </View>
  );
};

export default Payment;
