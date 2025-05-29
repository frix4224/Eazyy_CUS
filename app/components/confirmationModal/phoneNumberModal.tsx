import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { COLORS, showCustomToast, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { ErrorText } from "..";
import { useAtom, useSetAtom } from "jotai";
import { userAtom } from "../../store/auth";
import { ActivityIndicator } from "react-native-paper";
import { VerifyUserMobileNumberApi } from "../../services/methods/home";
import { SECURE_STRINGS } from "../../utils/secureStore/strings";
import { setSecureInfo } from "../../utils/secureStore";
import { UserInfo } from "../../customTypes/userInfo";
import { collectionAndDeliveryAtom } from "../../store";

function PhoneNumberVerification({
  isModalVisible,
  setModalVisible,
  mobile,
  isPickAndCollect,
  pickAndCollectonConfirm,
  mobileOtp,
}: {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  mobile: string;
  pickAndCollectonConfirm: () => void;
  isPickAndCollect: boolean;
  mobileOtp: string;
}) {
  const setCollectionData = useSetAtom(collectionAndDeliveryAtom);
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showLoading, setShowLoading] = useState<boolean>(false);

  useEffect(() => {
    if (mobileOtp) {
      setOtp(mobileOtp);
    }
  }, [mobileOtp]);

  const [userInfo, setUserInfo] = useAtom(userAtom);
  const onPressConfirm = async () => {
    if (otp === "") {
      setError("please enter otp");
      return null;
    }
    try {
      setShowLoading(true);
      const verifyOtpResponse = await VerifyUserMobileNumberApi(
        Number(mobile),
        Number(otp)
      );

      if (verifyOtpResponse.status === 200 && verifyOtpResponse.data.status) {
        const data: UserInfo = {
          email: userInfo?.email + "",
          userId: Number(userInfo?.userId),
          name: userInfo?.name + "",
          userIdentifier: Number(userInfo?.userIdentifier),
          token: userInfo?.token + "",
          mobile: mobile,
        };

        setUserInfo((prev) => {
          const data = prev as UserInfo;
          return {
            ...data,
            mobile: mobile + "",
          };
        });
        setOtp("");
        setCollectionData((prev) => ({ ...prev, phoneNumber: mobile }));
        setSecureInfo(SECURE_STRINGS.USER_INFO, JSON.stringify(data));
        showCustomToast("Mobile Number Updated Successfully!", "success");
        isPickAndCollect && pickAndCollectonConfirm();
        setModalVisible(false);
      }
    } catch (otpError: any) {
      console.log({ otpError: otpError.message });
    } finally {
      setShowLoading(false);
    }
  };

  const onPressCancel = () => {
    setError("");
    setOtp("");
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
            Verify OTP
          </Text>
          <Text allowFontScaling={false} style={styles.subHeading}>
            Please enter the OTP that we send to your mobile number ({mobile})
          </Text>
          <OTPInputView
            style={styles.otpStyles}
            pinCount={6}
            keyboardType="number-pad"
            code={otp}
            onCodeChanged={(code) => {
              setError("");
              setOtp(code);
            }}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.otpFieldStyles}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            // onCodeFilled={(code) => {
            //   console.log(`Code is ${code}, you are good to go!`);
            // }}
          />
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
                  verify
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtnContainer}
              activeOpacity={0.7}
              onPress={onPressCancel}
            >
              <Text allowFontScaling={false} style={styles.cancelBtnText}>
                cancel
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
    borderRadius: SIZING.scaleWidth(1),
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
  otpStyles: {
    height: SIZING.scaleHeight(10),
    marginTop: SIZING.scaleHeight(1),
    paddingHorizontal: SIZING.scaleWidth(5),
  },
  otpFieldStyles: {
    borderRadius: SIZING.scaleWidth(1.5),
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    color: COLORS.BLACK,
    height: SIZING.scaleHeight(7),
    width: SIZING.scaleWidth(13),
    fontSize: SIZING.scaleFont(5),
    fontFamily: FONTS.PoppinsLight,
    opacity: 0.4,
  },
  underlineStyleHighLighted: {
    borderColor: COLORS.BLACK,
  },
});

export default PhoneNumberVerification;
