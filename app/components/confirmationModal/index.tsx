import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import { ActivityIndicator } from "react-native-paper";

function AddressConfirm({
  isModalVisible,
  setModalVisible,
  title,
  onConfirm,
  confirmationloading,
}: {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  onConfirm: () => void;
  confirmationloading: boolean;
}) {
  const onPressCancel = () => {
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
          <Text style={styles.heading} allowFontScaling={false}>
            {title}
          </Text>
          {/* <Text style={styles.subHeading} allowFontScaling={false}>
            you want proceed with this address
          </Text> */}
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.cancelBtnContainer}
              activeOpacity={0.7}
              onPress={onPressCancel}
            >
              <Text allowFontScaling={false} style={styles.cancelBtnText}>
                cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={styles.confirmBtnContainer}
              activeOpacity={0.7}
            >
              {confirmationloading ? (
                <ActivityIndicator color={COLORS.WHITE} size={"small"} />
              ) : (
                <Text allowFontScaling={false} style={styles.confirmBtnText}>
                  confirm
                </Text>
              )}
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
    width: SIZING.scaleWidth(85),
    backgroundColor: COLORS.WHITE,
    paddingVertical: SIZING.scaleHeight(3),
    paddingHorizontal: SIZING.scaleHeight(3),
    borderRadius: SIZING.scaleWidth(2),
    alignItems: "center",
  },
  heading: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: SIZING.scaleFont(4.5),
    color: COLORS.BLACK,
    marginBottom: SIZING.scaleHeight(1),
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SIZING.scaleWidth(60),
    marginTop: SIZING.scaleHeight(2),
  },
  confirmBtnContainer: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SIZING.scaleHeight(1),
    width: SIZING.scaleWidth(25),
    borderRadius: SIZING.scaleWidth(1),
  },
  confirmBtnText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.8),
    textTransform: "uppercase",
    textAlign: "center",
  },
  cancelBtnContainer: {
    borderColor: COLORS.BLACK,
    borderWidth: SIZING.scaleWidth(0.12),
    paddingVertical: SIZING.scaleHeight(1),
    paddingHorizontal: SIZING.scaleWidth(2),
    borderRadius: SIZING.scaleWidth(1),
  },
  cancelBtnText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.8),
    textTransform: "uppercase",
  },
});

export default AddressConfirm;
