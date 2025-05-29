import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAtom } from "jotai";
import { userAtom } from "../../store/auth";
import { COLORS, showCustomToast, SIZING } from "../../utils";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "../../assets/fonts";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  ErrorText,
  OrderButton,
  PhoneNumberVerification,
} from "../../components";
import { useFormik } from "formik";
import { EditProfileSchema } from "../../schema/auth";
import {
  UpdateUserMobileNumberApi,
  UpdateUserProfileApi,
} from "../../services/methods/home";
import { UserProfileUpdateRequest } from "../../services/types/home";
import { UserInfo } from "../../customTypes/userInfo";
import { setSecureInfo } from "../../utils/secureStore";
import { SECURE_STRINGS } from "../../utils/secureStore/strings";

const EditDetails = () => {
  const [userInfo, setUserInfo] = useAtom(userAtom);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [mobileNumberLoading, setMobileNumberLoading] =
    useState<boolean>(false);
  const navigation = useNavigation();
  const [mobileOtp, setMobileOtp] = useState<string>("");

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: { name: userInfo?.name, mobileNumber: userInfo?.mobile },
    onSubmit: async () => {
      const payload: UserProfileUpdateRequest = {
        email: userInfo?.email + "",
        mobile: values.mobileNumber + "",
        name: values.name + "",
      };
      try {
        const updateProfileResponse = await UpdateUserProfileApi(payload);
        if (
          updateProfileResponse.status === 200 &&
          updateProfileResponse.data.status
        ) {
          showCustomToast("User profile updated", "success");
          const data: UserInfo = {
            email: updateProfileResponse.data.data.email,
            userId: updateProfileResponse.data.data.id,
            name: updateProfileResponse.data.data.name,
            token: userInfo?.token + "",
            userIdentifier: updateProfileResponse.data.data.user_identifier,
            mobile: updateProfileResponse.data.data.mobile,
          };
          setUserInfo(data);
          await setSecureInfo(SECURE_STRINGS.USER_INFO, JSON.stringify(data));
          navigation.goBack();
        }
      } catch (error: any) {
        showCustomToast(error.message, "danger");
        console.log({ error: error.message });
      } finally {
        setSubmitting(false);
      }
    },
    validationSchema: EditProfileSchema,
  });

  const requestMobileNumberOtp = async () => {
    if (values.mobileNumber === "") {
      showCustomToast("Please enter phone number", "warning");
      return null;
    }
    setMobileNumberLoading(true);
    try {
      const requestOtpResponse = await UpdateUserMobileNumberApi(
        Number(values.mobileNumber)
      );
      console.log({ requestOtpResponse: JSON.stringify(requestOtpResponse) });

      if (requestOtpResponse.status === 200) {
        showCustomToast("OTP sent successfully", "success");
        if (requestOtpResponse.data && requestOtpResponse.data.otp) {
          setMobileOtp(requestOtpResponse.data.otp + "");
        }
        setIsModalVisible(true);
      }
    } catch (error: any) {
      showCustomToast(error.message, "danger");
      console.log({ error: error.message });
    } finally {
      setMobileNumberLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backIconContainer}
        activeOpacity={0.5}
        onPress={() => navigation.goBack()}
      >
        <IonIcons
          name="arrow-back-outline"
          size={SIZING.scaleWidth(7)}
          color={COLORS.BLACK}
        />
      </TouchableOpacity>
      <View style={styles.headingContainer}>
        <View style={styles.headingBar} />
        <Text style={styles.headingText}>Contact Information</Text>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.contactDetailsWrapper}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameHeading}>Name</Text>
            <TextInput
              style={styles.nameText}
              placeholder="Enter your name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={() => setFieldTouched("name")}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              importantForAutofill="no"
            />
            <View style={styles.errorContainer}>
              <ErrorText error={errors.name} touched={touched.name} />
            </View>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameHeading}>Email</Text>
            <TextInput
              style={styles.nameText}
              editable={false}
              value={userInfo?.email}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameHeading}>Phone Number</Text>
            <TextInput
              onBlur={() => setFieldTouched("mobileNumber")}
              value={values.mobileNumber}
              onChangeText={handleChange("mobileNumber")}
              style={styles.nameText}
              placeholder="Enter your mobile number"
            />
            <View style={styles.errorContainer}>
              <ErrorText
                error={errors.mobileNumber}
                touched={touched.mobileNumber}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <OrderButton
          title="Save"
          onPress={() => {
            userInfo?.mobile === values.mobileNumber
              ? handleSubmit()
              : requestMobileNumberOtp();
          }}
          loading={isSubmitting || mobileNumberLoading}
        />
      </View>
      <PhoneNumberVerification
        isModalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        mobile={values.mobileNumber + ""}
        isPickAndCollect={false}
        pickAndCollectonConfirm={() => {}}
        mobileOtp={mobileOtp}
      />
    </ScrollView>
  );
};

export default EditDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIconContainer: {
    backgroundColor: COLORS.WHITE,
    paddingTop: SIZING.scaleHeight(4),
    paddingVertical: SIZING.scaleHeight(1.5),
    paddingHorizontal: SIZING.scaleWidth(5),
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(2),
  },
  headingText: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: SIZING.scaleFont(5),
    color: COLORS.BLACK,
  },
  headingBar: {
    height: SIZING.scaleHeight(2.2),
    backgroundColor: COLORS.PRIMARY,
    width: SIZING.scaleWidth(1),
    marginRight: SIZING.scaleWidth(2),
    borderRadius: SIZING.scaleWidth(2),
    marginTop: SIZING.scaleHeight(-0.5),
  },
  sectionContainer: {
    marginTop: SIZING.scaleHeight(2),
    minHeight: SIZING.scaleHeight(10),
  },
  contactDetailsWrapper: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(2),
    borderRadius: SIZING.scaleWidth(1.5),
    paddingHorizontal: SIZING.scaleWidth(3),
    paddingBottom: SIZING.scaleHeight(2),
  },
  nameContainer: {
    marginTop: SIZING.scaleHeight(2),
    marginHorizontal: SIZING.scaleWidth(5),
  },
  nameHeading: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(3.3),
    color: "#1A1D1F",
  },
  nameText: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.5),
    color: COLORS.BLACK,
    backgroundColor: "#F5F5F5",
    borderRadius: SIZING.scaleWidth(2),
    paddingLeft: SIZING.scaleWidth(3),
  },
  buttonContainer: {
    marginTop: SIZING.scaleHeight(5),
  },
  errorContainer: { marginLeft: SIZING.scaleWidth(1) },
});
