import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { COLORS, showCustomToast, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import { ErrorText } from "..";
import { ActivityIndicator } from "react-native-paper";
import { CancelOrderApi } from "../../services/methods/home";
import { useQueryClient } from "@tanstack/react-query";

function CancelOrderModal({
  isModalVisible,
  setModalVisible,
  orderId,
}: {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  orderId: number;
}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const onPressConfirm = async () => {
    if (cancelReason === "") {
      setError("please enter reason");
      return null;
    }
    setShowLoading(true);
    setError("");
    try {
      const cancelOrderResponse = await CancelOrderApi({
        order_number: orderId,
        remark: cancelReason,
      });

      if (cancelOrderResponse.status === 201) {
        showCustomToast("Order cancelled successfully!", "success");
        queryClient.invalidateQueries({ queryKey: ["user_orders"] });
        return;
      }
    } catch (error: any) {
      showCustomToast("Unable to cancel the order", "danger");
      console.log({ error: error.message });
    } finally {
      setShowLoading(false);
      setModalVisible(false);
    }
  };

  const onPressCancel = () => {
    setError("");
    setCancelReason("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={onPressCancel}
        style={styles.modal}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
      >
        <View style={styles.modalContent}>
          <Text allowFontScaling={false} style={styles.heading}>
            Cancel this order
          </Text>
          <Text allowFontScaling={false} style={styles.subHeading}>
            Are you sure to cancel this order?
          </Text>
          <View
            style={{
              borderColor: COLORS.GRAY,
              borderWidth: 1,
              paddingHorizontal: SIZING.scaleWidth(2),
            }}
          >
            <TextInput
              placeholder="enter reason to cancel the order"
              multiline
              style={styles.reasonTextInput}
              textAlignVertical="top"
              value={cancelReason}
              onChangeText={(text) => setCancelReason(text)}
            />
          </View>
          <ErrorText error={error} touched />
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={onPressConfirm}
              disabled={showLoading}
              style={styles.confirmBtnContainer}
              activeOpacity={0.7}
            >
              {showLoading ? (
                <ActivityIndicator color={COLORS.WHITE} size={"small"} />
              ) : (
                <Text allowFontScaling={false} style={styles.confirmBtnText}>
                  cancel order
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtnContainer}
              activeOpacity={0.7}
              onPress={onPressCancel}
            >
              <Text allowFontScaling={false} style={styles.cancelBtnText}>
                close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: SIZING.scaleWidth(95),
    backgroundColor: COLORS.WHITE,
    paddingVertical: SIZING.scaleHeight(3),
    borderRadius: SIZING.scaleWidth(2),
    alignItems: "center",
  },
  heading: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: SIZING.scaleFont(4.5),
    color: COLORS.BLACK,
    marginBottom: SIZING.scaleHeight(1),
    textAlign: "center",
  },
  subHeading: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(3.8),
    color: COLORS.BLACK,
    textAlign: "center",
    marginBottom: SIZING.scaleHeight(1),
  },
  btnContainer: {
    marginTop: SIZING.scaleHeight(2),
    alignItems: "center",
  },
  confirmBtnContainer: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SIZING.scaleHeight(1),
    paddingHorizontal: SIZING.scaleWidth(2),
    borderRadius: SIZING.scaleWidth(2),
    width: SIZING.scaleWidth(50),
  },
  confirmBtnText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4),
    textTransform: "uppercase",
    textAlign: "center",
  },
  cancelBtnContainer: {
    marginTop: SIZING.scaleHeight(2),
  },
  cancelBtnText: {
    textAlign: "center",
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(3.5),
    textTransform: "uppercase",
  },
  reasonTextInput: {
    height: SIZING.scaleHeight(20),
    width: SIZING.scaleWidth(80),
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.BLACK,
  },
});

export default CancelOrderModal;
