import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAtom, useSetAtom } from "jotai";
import { userAtom } from "../../store/auth";
import { setSecureInfo } from "../../utils/secureStore";
import { SECURE_STRINGS } from "../../utils/secureStore/strings";
import { COLORS, showCustomToast, SIZING } from "../../utils";
import { navigationRef } from "../../../App";
import { CommonActions, useNavigation } from "@react-navigation/native";
import {
  MAIN_NAV_STRINGS,
  TAB_ACCOUNT_STACK_STRINGS,
} from "../../navigation/constants";
import { FONTS } from "../../assets/fonts";
import OctIcons from "react-native-vector-icons/Octicons";
import { ActivityIndicator } from "react-native-paper";
import {
  DeleteUserAddressApi,
  FetchUserAddressApi,
  FetchUserProfileApi,
} from "../../services/methods/home";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserAddressesType } from "../../customTypes/home";
import { UserInfo } from "../../customTypes/userInfo";
import { cartItemsAtoms } from "../../store";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ConfirmationModal } from "../../components";

const AccountScreen = () => {
  const [userInfo, setUserInfo] = useAtom(userAtom);
  const setCartItems = useSetAtom(cartItemsAtoms);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [userAddressList, setUserAddressList] = useState<UserAddressesType[]>(
    []
  );
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const onPressLogout = async () => {
    setUserInfo(undefined);
    await setSecureInfo(SECURE_STRINGS.ACCESS_TOKEN, "");
    await setSecureInfo(SECURE_STRINGS.USER_INFO, "");
    setCartItems([]);
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: MAIN_NAV_STRINGS.AUTHSTACK }],
      })
    );
  };
  const { data: userAddressData, isLoading } = useQuery({
    queryKey: ["user_addresses"],
    queryFn: FetchUserAddressApi,
    refetchOnMount: true,
    refetchInterval: 30000,
  });
  const { data: userProfileData, isLoading: userProfileLoading } = useQuery({
    queryKey: ["user_profile"],
    queryFn: FetchUserProfileApi,
    refetchOnMount: true,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["delete_address"],
    mutationFn: (addressId: string) =>
      DeleteUserAddressApi(addressId, userInfo?.userId + ""),
    onSuccess: (deleteAddressResponse) => {
      try {
        if (
          deleteAddressResponse.status === 200 &&
          deleteAddressResponse.data.status
        ) {
          queryClient.invalidateQueries({ queryKey: ["user_addresses"] });
          showCustomToast("Address deleted successfully", "success");
          setShowConfirmationModal(false);
        }
      } catch (error: any) {
        console.log({ error: error.message });

        showCustomToast("Something went wrong", "danger");
      }
    },
  });
  useEffect(() => {
    if (userProfileData?.status === 200 && userProfileData.data.status) {
      const data: UserInfo = {
        email: userProfileData.data.data.email,
        userId: userProfileData.data.data.id,
        name: userProfileData.data.data.name,
        token: userInfo?.token + "",
        userIdentifier: userProfileData.data.data.user_identifier,
        mobile: userProfileData.data.data.mobile,
      };
      setUserInfo(data);
    }
  }, [userProfileData]);
  useEffect(() => {
    if (
      userAddressData?.status === 200 &&
      userAddressData.data.status &&
      userAddressData.data.data.length > 0
    ) {
      setUserAddressList(userAddressData.data.data);
    } else {
      setUserAddressList([]);
    }
  }, [userAddressData]);

  const userFirstName = useMemo(() => {
    if (userInfo?.name) {
      return userInfo?.name.split(" ")[0];
    }
    return "-";
  }, [userInfo?.name]);

  const userLastName = useMemo(() => {
    if (userInfo?.name) {
      return userInfo?.name.split(" ")[1];
    }
    return "-";
  }, [userInfo?.name]);
  const onPressDeleteAddress = async () => {
    await mutateAsync(selectedAddressId);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headingContainer}>
        <View style={styles.headingBar} />
        <Text style={styles.headingText}>Account</Text>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.contactDetailsContainer}>
          <Text style={styles.sectionHeading}>Addresses</Text>
          <TouchableOpacity
            style={styles.editDetailsConatiner}
            activeOpacity={0.5}
            disabled={isLoading}
            onPress={() =>
              navigation.navigate(MAIN_NAV_STRINGS.ADD_ADDRESS as never)
            }
          >
            <OctIcons
              name="pencil"
              color={COLORS.PRIMARY}
              size={SIZING.scaleFont(3.8)}
            />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            ListEmptyComponent={
              <Text style={styles.emptyAddressText}>No address found</Text>
            }
            data={userAddressList}
            style={{
              backgroundColor: COLORS.WHITE,
              marginHorizontal: SIZING.scaleWidth(5),
              borderRadius: SIZING.scaleWidth(2),
              marginTop: SIZING.scaleHeight(3),
              paddingBottom: SIZING.scaleHeight(3),
            }}
            renderItem={({ item }) => (
              <View style={styles.addressWrapper}>
                <View style={styles.addressContainer}>
                  <Text style={styles.addressText}>{item.address}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    setSelectedAddressId(item.id + "");
                    setShowConfirmationModal(true);
                  }}
                >
                  <MaterialCommunityIcons
                    name="minus-box-outline"
                    color={COLORS.PRIMARY}
                    size={SIZING.scaleWidth(6)}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
      <View
        style={[styles.sectionContainer, { marginTop: SIZING.scaleHeight(4) }]}
      >
        <View style={styles.contactDetailsContainer}>
          <Text style={styles.sectionHeading}>Contact Details</Text>
          <TouchableOpacity
            disabled={userProfileLoading}
            style={styles.editDetailsConatiner}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate(
                TAB_ACCOUNT_STACK_STRINGS.EDIT_PROFILE as never
              )
            }
          >
            <Text style={styles.editDetailsText}>Edit Details</Text>
            <OctIcons
              name="pencil"
              color={COLORS.PRIMARY}
              size={SIZING.scaleFont(3.8)}
            />
          </TouchableOpacity>
        </View>
        {userProfileLoading ? (
          <ActivityIndicator
            color={COLORS.PRIMARY}
            size={"large"}
            style={{ marginTop: SIZING.scaleHeight(2) }}
          />
        ) : (
          <View style={styles.contactDetailsWrapper}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameHeading}>First Name</Text>
              <Text style={styles.nameText}>{userFirstName}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameHeading}>Last Name</Text>
              <Text style={styles.nameText}>{userLastName}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameHeading}>Mobile Number</Text>
              <Text style={styles.nameText}>{userInfo?.mobile}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameHeading}>Email</Text>
              <Text style={styles.nameText}>{userInfo?.email}</Text>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPressLogout}
        style={styles.logoutContainer}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <ConfirmationModal
        isModalVisible={showConfirmationModal}
        setModalVisible={setShowConfirmationModal}
        title="Are you sure you want to delete this address ?"
        onConfirm={onPressDeleteAddress}
        confirmationloading={isPending}
      />
    </ScrollView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SIZING.scaleHeight(3),
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
  sectionHeading: {
    fontFamily: FONTS.PoppinsMedium,
    color: COLORS.PRIMARY,
    fontSize: SIZING.scaleFont(4),
    marginLeft: SIZING.scaleWidth(5),
    textTransform: "capitalize",
  },
  addressWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    marginTop: SIZING.scaleHeight(1),
    borderRadius: SIZING.scaleWidth(1.5),
    paddingHorizontal: SIZING.scaleWidth(3),
  },
  addressContainer: {
    marginTop: SIZING.scaleHeight(2),
    marginLeft: SIZING.scaleWidth(5),
  },
  addressText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
    width: SIZING.scaleWidth(56),
  },
  contactDetailsWrapper: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(2),
    borderRadius: SIZING.scaleWidth(1.5),
    paddingHorizontal: SIZING.scaleWidth(3),
    paddingVertical: SIZING.scaleHeight(2),
  },
  contactDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: SIZING.scaleWidth(5),
  },
  editDetailsConatiner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SIZING.scaleWidth(2),
    paddingVertical: SIZING.scaleWidth(1),
    borderRadius: SIZING.scaleWidth(5),
  },
  editDetailsText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(3),
    color: COLORS.PRIMARY,
    marginRight: SIZING.scaleWidth(2),
  },
  nameContainer: {
    marginTop: SIZING.scaleHeight(2),
    marginHorizontal: SIZING.scaleWidth(5),
  },
  nameHeading: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.BLACK,
  },
  nameText: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.GRAY,
  },
  logoutContainer: {
    marginTop: SIZING.scaleHeight(2),
    marginBottom: SIZING.scaleHeight(10),
  },
  logoutText: {
    textAlign: "center",
    color: COLORS.PRIMARY,
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: SIZING.scaleFont(4),
  },
  emptyAddressText: {
    textAlign: "center",
    marginTop: SIZING.scaleHeight(2),
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4),
  },
});
