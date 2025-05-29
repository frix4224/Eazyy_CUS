import React from "react";
import { View } from "react-native";
import WebView, { WebViewNavigation } from "react-native-webview";
import { SIZING } from "../../utils";
import { useSetAtom } from "jotai";
import { paymentDataAtom, paymentLoadingAtom } from "../../store";

const Payment = ({ route, navigation }) => {
  const checkout_url: string = route?.params?.checkout_url;
  const setPaymentData = useSetAtom(paymentDataAtom);
  const setPaymentLoading = useSetAtom(paymentLoadingAtom);

  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;
    if (url.includes("payment/success")) {
      setPaymentData((prev) => ({
        paymentId: prev.paymentId,
        payment_transaction_id: parseInt(url.split("transaction_id=")[1]),
      }));
      setPaymentLoading(true);
      navigation.goBack();
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: checkout_url }}
        minimumFontSize={12}
        onNavigationStateChange={handleNavigationStateChange}
        containerStyle={{ paddingTop: SIZING.scaleHeight(5) }}
      />
    </View>
  );
};

export default Payment;
