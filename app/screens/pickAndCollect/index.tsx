import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, showCustomToast, SIZING } from "../../utils";
import IonIcons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "../../assets/fonts";
import { IMAGES } from "../../assets/images";
import {
  ConfirmationModal,
  OrderButton,
  PhoneNumberVerification,
} from "../../components";
import { MAIN_NAV_STRINGS } from "../../navigation/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeleteUserAddressApi,
  FetchCollectFromApi,
  FetchSlotsApi,
  FetchUserAddressApi,
  FindNearbyFacilityApi,
  UpdateUserMobileNumberApi,
} from "../../services/methods/home";
import { ActivityIndicator } from "react-native-paper";
import {
  CollectFromType,
  SlotsType,
  UserAddressesType,
} from "../../customTypes/home";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";
import { useAtom, useAtomValue } from "jotai";
import { collectionAndDeliveryAtom } from "../../store";
import { userAtom } from "../../store/auth";
import RNDatePicker from "@react-native-community/datetimepicker";

const Header = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
        <IonIcons
          name="chevron-back-outline"
          color={COLORS.BLACK}
          size={SIZING.scaleWidth(8)}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Collection & Delivery</Text>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate(MAIN_NAV_STRINGS.ADD_ADDRESS as never)
        }
      >
        <Text style={styles.headerAddAddress}>add address</Text>
      </TouchableOpacity>
    </View>
  );
};

const PickAndCollectScreen = () => {
  const [collectionData, setCollectionData] = useAtom(
    collectionAndDeliveryAtom
  );
  const [userAddressList, setUserAddressList] = useState<UserAddressesType[]>(
    []
  );
  const [selectedPickupSlot, setSelectedPickupSlot] = useState<SlotsType>();
  const [selectedDropSlot, setSelectedDropSlot] = useState<SlotsType>();

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const phoneNumberRef = useRef<TextInput>(null);

  const [searchFacility, setSearchFacility] = useState(false);
  const [facilityData, setFacilityData] = useState({ facilityId: 0 });
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [mobileNumberLoading, setMobileNumberLoading] =
    useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const userInfo = useAtomValue(userAtom);
  const [mobileOtp, setMobileOtp] = useState<string>("");
  const [slotsList, setSlotsList] = useState<SlotsType[]>([]);
  const [collectFromList, setCollectFromList] = useState<CollectFromType[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const today = moment().startOf("day");
  const endOfMonth = moment().endOf("month");

  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showDropPicker, setShowDropPicker] = useState(false);
  const { data: facilitySearch, isPending: facilitySearchLoading } = useQuery({
    queryKey: ["facility_search"],
    queryFn: () =>
      FindNearbyFacilityApi({
        lat: collectionData.selectedAddress.lat,
        long: collectionData.selectedAddress.long,
      }),
    enabled: searchFacility,
  });
  const { data: userAddressData, isLoading } = useQuery({
    queryKey: ["user_addresses"],
    queryFn: FetchUserAddressApi,
    refetchOnMount: false,
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
  const { data: userSlots } = useQuery({
    queryKey: ["user_slots"],
    queryFn: FetchSlotsApi,
    refetchOnMount: false,
  });
  const { data: collectFromData } = useQuery({
    queryKey: ["user_collects_from"],
    queryFn: FetchCollectFromApi,
    refetchOnMount: false,
  });

  const onPressDeleteAddress = async () => {
    await mutateAsync(selectedAddressId);
  };

  useEffect(() => {
    if (facilitySearch?.status === 200 && facilitySearch.data.data !== 1) {
      setFacilityData({ facilityId: facilitySearch.data.data.facility_id });
      setSearchFacility(false);
    }
  }, [facilitySearch]);

  useEffect(() => {
    if (
      userAddressData?.status === 200 &&
      userAddressData.data.status &&
      userAddressData.data.data.length > 0
    ) {
      setUserAddressList(userAddressData.data.data);
      setCollectionData((prev) => ({
        ...prev,
        selectedAddress: userAddressData.data.data[0],
      }));
      setSearchFacility(true);
    }
  }, [userAddressData]);

  useEffect(() => {
    if (
      userSlots?.status === 200 &&
      userSlots.data.status &&
      userSlots.data.data.length > 0
    ) {
      setSlotsList(userSlots.data.data);
      setSelectedPickupSlot(userSlots.data.data[0]);
      setSelectedDropSlot(userSlots.data.data[0]);
      setCollectionData((prev) => ({
        ...prev,
        selectedSlot: userSlots.data.data[0].name,
        selectedSlotTime: moment(
          userSlots.data.data[0].start_time,
          "HH:mm"
        ).format("HH:mm"),
        dropSlotTime: moment(userSlots.data.data[0].start_time, "HH:mm").format(
          "HH:mm"
        ),
        dropSlot: userSlots.data.data[0].name,
      }));
    }
  }, [userSlots]);

  useEffect(() => {
    if (userInfo?.mobile) {
      setCollectionData((prev) => ({ ...prev, phoneNumber: userInfo.mobile }));
    }
  }, [userInfo?.mobile]);

  useEffect(() => {
    if (
      collectFromData?.status === 200 &&
      collectFromData.data.status &&
      collectFromData.data.data.length > 0
    ) {
      setCollectFromList(collectFromData.data.data);
    }
  }, [collectFromData]);

  const handlePickupChange = (event, selectedDate) => {
    if (selectedDate) {
      let newSelctedPickup: Date = moment().toDate();
      let newSelctedDrop: Date = moment(collectionData.dropDate).toDate();
      const newPickupDate = moment(selectedDate).startOf("day");
      newSelctedPickup = newPickupDate.toDate();

      if (moment(collectionData.dropDate).isBefore(newPickupDate)) {
        newSelctedDrop = newPickupDate.toDate();
      }
      setCollectionData((prev) => ({
        ...prev,
        scheduleDate: newSelctedPickup,
        dropDate: newSelctedDrop,
      }));
    }
    setShowPickupPicker(false);
  };

  const handleDropChange = (event, selectedDate) => {
    if (selectedDate) {
      const newDropDate = moment(selectedDate).startOf("day");
      setCollectionData((prev) => ({
        ...prev,
        dropDate: newDropDate.toDate(),
      }));
    }
    setShowDropPicker(false);
  };
  const onPressNext = () => {
    if (!collectionData.selectedAddress.id) {
      showCustomToast("Please select a address", "warning");
      return;
    }
    if (collectionData.phoneNumber.length < 1) {
      showCustomToast("Please update your phone number", "warning");
      return;
    }
    if (!collectionData.selectedSlot) {
      showCustomToast("Please select a pickup slot", "warning");
      return;
    }
    if (!collectionData.schedule_collect_from.id) {
      showCustomToast("Please select collect from", "warning");
      return;
    }
    if (!collectionData.dropSlot) {
      showCustomToast("Please select a drop slot", "warning");
      return;
    }
    if (!collectionData.drop_collect_from.id) {
      showCustomToast("Please select collect by", "warning");
      return;
    }
    navigation.navigate(MAIN_NAV_STRINGS.CHECKOUT as never, {
      facilityId: facilityData.facilityId,
    });
  };

  const requestMobileNumberOtp = async () => {
    if (collectionData.phoneNumber === "") {
      showCustomToast("Please enter phone number", "warning");
      return null;
    }
    setMobileNumberLoading(true);
    try {
      const requestOtpResponse = await UpdateUserMobileNumberApi(
        Number(collectionData.phoneNumber)
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

  const pickUpDateValue = useMemo(() => {
    if (collectionData.scheduleDate) {
      return moment(collectionData.scheduleDate).format("DD-MMM-YYYY");
    }
    return "";
  }, [collectionData.scheduleDate]);

  const dropDateValue = useMemo(() => {
    if (collectionData.dropDate) {
      return moment(collectionData.dropDate).format("DD-MMM-YYYY");
    }
    return "";
  }, [collectionData.dropDate]);
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView onScroll={() => phoneNumberRef.current?.blur()}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>choose address</Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              ListEmptyComponent={
                <Text style={styles.emptyAddressText}>No address found</Text>
              }
              data={userAddressList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCollectionData((prev) => ({
                      ...prev,
                      selectedAddress: item,
                    }));
                    setSearchFacility(true);
                    setFacilityData({ facilityId: 0 });
                  }}
                  style={[
                    styles.addressWrapper,
                    {
                      borderColor: COLORS.PRIMARY,
                      borderWidth:
                        collectionData.selectedAddress.id === item.id ? 1 : 0,
                    },
                  ]}
                  activeOpacity={0.5}
                >
                  <Feather
                    name="home"
                    color={COLORS.PRIMARY}
                    size={SIZING.scaleWidth(6)}
                  />
                  <View style={styles.addressContainer}>
                    <Text style={styles.addressText}>{item.address}</Text>
                  </View>
                  <View />
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
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        <View style={styles.phoneNumberWrapper}>
          <Text style={styles.sectionHeading}>Phone Number</Text>
          <View style={styles.phoneNumberAndEditContainer}>
            <View style={styles.phoneNumberContainer}>
              <IonIcons
                name="call-outline"
                size={SIZING.scaleWidth(6)}
                color={COLORS.PRIMARY}
              />
              <TextInput
                ref={phoneNumberRef}
                style={styles.phoneNumberText}
                allowFontScaling={false}
                keyboardType="number-pad"
                placeholder="Enter your phone number"
                returnKeyType="done"
                value={collectionData.phoneNumber}
                maxLength={10}
                onChangeText={(text) =>
                  setCollectionData((prev) => ({ ...prev, phoneNumber: text }))
                }
              />
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>schedule pickup</Text>
          <TouchableOpacity
            style={styles.pickupWrapper}
            activeOpacity={0.5}
            onPress={() => setShowPickupPicker(true)}
          >
            <View style={styles.pickupContainer}>
              <Image source={IMAGES.PERSON} style={styles.iconImgStyles} />
              <Text style={styles.pickupText}>{pickUpDateValue}</Text>
              {showPickupPicker && (
                <RNDatePicker
                  mode="date"
                  display="calendar"
                  minimumDate={today.toDate()}
                  maximumDate={endOfMonth.toDate()}
                  value={collectionData.scheduleDate}
                  onChange={handlePickupChange}
                />
              )}
            </View>
            <Image source={IMAGES.EDIT} style={styles.editIconStyles} />
          </TouchableOpacity>
          <View style={styles.pickupWrapper}>
            <View style={styles.pickupContainer}>
              <Image source={IMAGES.CLOCK} style={styles.iconImgStyles} />
              <Dropdown
                style={styles.dropdown}
                renderItem={({ start_time, end_time }) => {
                  const startTime = moment(start_time, "HH:mm").format("HH:mm");
                  const endTime = moment(end_time, "HH:mm").format("HH:mm");
                  return (
                    <Text style={styles.slotDropdownText}>
                      {startTime} - {endTime}
                    </Text>
                  );
                }}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconColor={COLORS.WHITE}
                data={slotsList}
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder={"Select pickup slot"}
                value={selectedPickupSlot}
                onChange={(item) => {
                  setCollectionData((prev) => ({
                    ...prev,
                    selectedSlot: item.name,
                    selectedSlotTime: moment(item.start_time, "HH:mm").format(
                      "HH:mm"
                    ),
                  }));
                  setSelectedPickupSlot(item);
                }}
              />
            </View>
          </View>
          <View style={styles.pickupWrapper}>
            <View style={styles.pickupContainer}>
              <Image source={IMAGES.PERSON} style={styles.iconImgStyles} />
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconColor={COLORS.WHITE}
                data={collectFromList}
                maxHeight={300}
                labelField="from"
                valueField="id"
                placeholder={"Collect from"}
                value={collectionData.schedule_collect_from}
                onChange={(item) => {
                  setCollectionData((prev) => ({
                    ...prev,
                    schedule_collect_from: item,
                  }));
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>schedule drop</Text>
          <TouchableOpacity
            style={styles.pickupWrapper}
            activeOpacity={0.5}
            onPress={() => setShowDropPicker(true)}
          >
            <View style={styles.pickupContainer}>
              <Image source={IMAGES.CALENDAR} style={styles.iconImgStyles} />
              <Text style={styles.pickupText}>{dropDateValue}</Text>
              {showDropPicker && (
                <RNDatePicker
                  display="calendar"
                  minimumDate={moment(collectionData.scheduleDate).toDate()}
                  maximumDate={endOfMonth.toDate()}
                  mode="date"
                  value={collectionData.dropDate}
                  onChange={handleDropChange}
                />
              )}
            </View>
            <Image source={IMAGES.EDIT} style={styles.editIconStyles} />
          </TouchableOpacity>
          <View style={styles.pickupWrapper}>
            <View style={styles.pickupContainer}>
              <Image source={IMAGES.CLOCK} style={styles.iconImgStyles} />
              <Dropdown
                style={styles.dropdown}
                renderItem={({ start_time, end_time }) => {
                  const startTime = moment(start_time, "HH:mm").format("HH:mm");
                  const endTime = moment(end_time, "HH:mm").format("HH:mm");
                  return (
                    <Text style={styles.slotDropdownText}>
                      {startTime} - {endTime}
                    </Text>
                  );
                }}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconColor={COLORS.WHITE}
                data={slotsList}
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder={"Select drop slot"}
                value={selectedDropSlot}
                onChange={(item) => {
                  setCollectionData((prev) => ({
                    ...prev,
                    dropSlot: item.name,
                    dropSlotTime: moment(item.start_time, "HH:mm").format(
                      "HH:mm"
                    ),
                  }));
                  setSelectedDropSlot(item);
                }}
              />
            </View>
          </View>
          <View style={styles.pickupWrapper}>
            <View style={styles.pickupContainer}>
              <Image source={IMAGES.PERSON} style={styles.iconImgStyles} />
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconColor={COLORS.WHITE}
                data={collectFromList}
                maxHeight={300}
                labelField="from"
                valueField="id"
                placeholder={"Collect by"}
                value={collectionData.drop_collect_from}
                onChange={(item) => {
                  setCollectionData((prev) => ({
                    ...prev,
                    drop_collect_from: item,
                  }));
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.devlieryNotesContainer}>
          <TextInput
            style={styles.textInputContainer}
            placeholder="Add driver notes ..."
            textAlignVertical="top"
            autoComplete="off"
            autoCorrect={false}
            multiline
            value={collectionData.driver_notes}
            onChangeText={(text) =>
              setCollectionData((prev) => ({ ...prev, driver_notes: text }))
            }
          />
          <TextInput
            style={styles.textInputContainer}
            placeholder="Add facilities notes ..."
            textAlignVertical="top"
            autoComplete="off"
            autoCorrect={false}
            multiline
            value={collectionData.facility_notes}
            onChangeText={(text) =>
              setCollectionData((prev) => ({ ...prev, facility_notes: text }))
            }
          />
        </View>
        <OrderButton
          title="next"
          loading={mobileNumberLoading}
          onPress={() => {
            userInfo?.mobile === collectionData.phoneNumber
              ? onPressNext()
              : requestMobileNumberOtp();
          }}
        />
      </ScrollView>
      <ConfirmationModal
        isModalVisible={showConfirmationModal}
        setModalVisible={setShowConfirmationModal}
        title="Are you sure you want to delete this address ?"
        onConfirm={onPressDeleteAddress}
        confirmationloading={isPending}
      />
      <PhoneNumberVerification
        isModalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        mobile={collectionData.phoneNumber}
        pickAndCollectonConfirm={onPressNext}
        isPickAndCollect={true}
        mobileOtp={mobileOtp}
      />
    </View>
  );
};

export default PickAndCollectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
    paddingTop: SIZING.scaleHeight(5),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZING.scaleWidth(2),
    paddingHorizontal: SIZING.scaleWidth(5),
  },
  headerTitle: {
    color: COLORS.BLACK,
    fontFamily: FONTS.Inter18Black,
    fontSize: SIZING.scaleFont(3.5),
  },
  headerAddAddress: {
    textTransform: "uppercase",
    textDecorationLine: "underline",
    color: COLORS.PRIMARY,
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.5),
  },
  sectionContainer: {
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SIZING.scaleWidth(4.5),
    borderRadius: SIZING.scaleWidth(2),
    marginTop: SIZING.scaleHeight(2),
    paddingVertical: SIZING.scaleHeight(2),
  },
  sectionHeading: {
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.BLACK,
    fontSize: SIZING.scaleFont(3.8),
    marginLeft: SIZING.scaleWidth(5),
    textTransform: "capitalize",
  },
  addressWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0946721A",
    marginHorizontal: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(1),
    borderRadius: SIZING.scaleWidth(2),
    paddingHorizontal: SIZING.scaleWidth(3),
    paddingVertical: SIZING.scaleHeight(1),
    minHeight: SIZING.scaleHeight(10),
  },
  addressContainer: {},
  addressText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.5),
    width: SIZING.scaleWidth(56),
  },
  iconImgStyles: {
    width: SIZING.scaleWidth(5),
    height: SIZING.scaleHeight(3),
    resizeMode: "contain",
  },
  editIconStyles: {
    width: SIZING.scaleWidth(7),
    height: SIZING.scaleHeight(4),
    resizeMode: "contain",
  },
  pickupContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickupWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZING.scaleWidth(6),
    marginTop: SIZING.scaleHeight(1),
  },
  pickupText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.BLACK,
    opacity: 0.5,
    marginLeft: SIZING.scaleWidth(2),
    marginTop: SIZING.scaleHeight(0.5),
  },
  devlieryNotesContainer: {
    marginTop: SIZING.scaleHeight(2),
  },
  textInputContainer: {
    height: SIZING.scaleHeight(12),
    backgroundColor: "#09467222",
    borderRadius: SIZING.scaleWidth(2),
    paddingHorizontal: SIZING.scaleWidth(5),
    marginBottom: SIZING.scaleHeight(2),
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsRegular,
    marginHorizontal: SIZING.scaleWidth(5),
  },
  dropdown: {
    height: SIZING.scaleHeight(5),
    width: SIZING.scaleWidth(70),
    borderColor: COLORS.PRIMARY,
    borderBottomWidth: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginLeft: SIZING.scaleWidth(2),
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
  },
  placeholderStyle: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
  },
  selectedTextStyle: {
    fontSize: SIZING.scaleFont(4),
    fontFamily: FONTS.PoppinsMedium,
    color: COLORS.PRIMARY,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  slotDropdownText: {
    marginTop: SIZING.scaleHeight(1),
    marginLeft: SIZING.scaleWidth(5),
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.BLACK,
  },
  phoneNumberWrapper: {
    marginTop: SIZING.scaleHeight(2),
    marginLeft: SIZING.scaleWidth(2),
    marginBottom: SIZING.scaleHeight(1),
  },
  phoneNumberAndEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SIZING.scaleWidth(5),
  },
  phoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9F0",
    borderRadius: SIZING.scaleWidth(2),
    paddingLeft: SIZING.scaleWidth(5),
    width: SIZING.scaleWidth(88),
  },
  phoneNumberText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(3.5),
    color: COLORS.GRAY,
    marginLeft: SIZING.scaleWidth(3),
    width: SIZING.scaleWidth(70),
    marginTop: SIZING.scaleHeight(0.8),
    paddingVertical: SIZING.scaleHeight(0.8),
  },
  emptyAddressText: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.BLACK,
    marginTop: SIZING.scaleHeight(3),
    textAlign: "center",
  },
});
