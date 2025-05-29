import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Card, Button, Divider } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS, showCustomToast, SIZING } from "../../utils";
import { OrderButton } from "../../components";
import { FONTS } from "../../assets/fonts";
import { IMAGES } from "../../assets/images";
import {
  CreateCODOrderApi,
  CreateOnlineOrderApi,
  VerifyOnlinePaymentApi,
} from "../../services/methods/home";
import {
  PlaceCODOrderRequest,
  PlaceOnlineOrderRequest,
} from "../../services/types/home";
import { useNavigation } from "@react-navigation/native";
import { MAIN_NAV_STRINGS } from "../../navigation/constants";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "../../store/auth";
import {
  cartItemsAtoms,
  collectionAndDeliveryAtom,
  paymentDataAtom,
  paymentLoadingAtom,
} from "../../store";
import moment from "moment";
import IonIcons from "react-native-vector-icons/Ionicons";
import FullScreenLoader from "../../components/fullScreenLoader";
import { useQueryClient } from "@tanstack/react-query";

const BreakdownItem = ({
  label,
  amount,
  bold = false,
}: {
  label: string;
  amount: string;
  bold?: boolean;
}) => (
  <View style={styles.breakdownItem}>
    <Text style={[styles.breakdownLabel, bold && styles.boldText]}>
      {label}
    </Text>
    <Text style={[styles.breakdownLabel, bold && styles.boldText]}>
      {amount}
    </Text>
  </View>
);

export default function Checkout({ route }) {
  const [showCODLoading, setShowCODLoading] = useState<boolean>(false);
  const [showOnlineLoading, setShowOnlineLoading] = useState<boolean>(false);
  const userInfo = useAtomValue(userAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtoms);
  const [paymentLoading, setPaymentLoading] = useAtom(paymentLoadingAtom);
  const [paymentData, setPaymentData] = useAtom(paymentDataAtom);

  const { facilityId } = route.params;

  const queryClient = useQueryClient();
  const [collectionData, setCollectionData] = useAtom(
    collectionAndDeliveryAtom
  );

  const navigation = useNavigation();

  const onVerifyPayment = async () => {
    const payload: PlaceCODOrderRequest = {
      facility_id: facilityId,
      user_id: Number(userInfo?.userId),
      mobile: collectionData.phoneNumber,
      user_address_id: collectionData.selectedAddress.id,
      sub_total: Number(orderTotal),
      discount: 0,
      tax_percentage: 0,
      total_amount: Number(orderTotal),
      payment_method: "ONLINE",
      driver_notes: collectionData.driver_notes,
      payment_id: paymentData.paymentId,
      transaction_id: paymentData.payment_transaction_id,
      facility_notes: collectionData.facility_notes,
      schedule: {
        pickup: {
          date: pickupDate,
          slot: collectionData.selectedSlot,
          time: collectionData.selectedSlotTime,
          collect_from_id: collectionData.schedule_collect_from.id,
        },
        drop: {
          date: dropDate,
          slot: collectionData.dropSlot,
          time: collectionData.dropSlotTime,
          collect_from_id: collectionData.drop_collect_from.id,
        },
      },

      items: cartItems.map((ci) => ({
        item_id: ci.item.item_id,
        amount: ci.item.item.price,
        quantity: ci.quantity,
        service_id: ci.itemId,
        category_id: ci.item.service_category_id,
      })),
    };

    try {
      const verifyPaymentResponse = await VerifyOnlinePaymentApi(payload);
      if (
        verifyPaymentResponse.status === 201 &&
        verifyPaymentResponse.data.status
      ) {
        setCartItems([]);
        setPaymentLoading(false);
        setPaymentData({ payment_transaction_id: 0, paymentId: "" });
        navigation.navigate(MAIN_NAV_STRINGS.ORDER_SUCCESS as never, {
          orderId: verifyPaymentResponse.data.data.order_number,
        });
        queryClient.invalidateQueries({ queryKey: ["user_orders"] });
        setCollectionData({
          selectedAddress: {
            id: 0,
            user_id: 0,
            lat: 0,
            long: 0,
            default: 0,
            address: "",
            type: "",
            created_at: "",
          },
          scheduleDate: moment().toDate(),
          selectedSlot: "",
          selectedSlotTime: "",
          schedule_collect_from: { id: 0, from: "" },
          dropDate: moment().toDate(),
          dropSlot: "",
          dropSlotTime: "",
          drop_collect_from: { id: 0, from: "" },
          driver_notes: "",
          facility_notes: "",
          phoneNumber: "",
        });
      }
    } catch (error: any) {
      console.log({ error: error.message });
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (paymentLoading === true) {
      onVerifyPayment();
    }
  }, [paymentLoading]);

  const onPressCheckoutCODOrder = async () => {
    if (Number(facilityId) === 0) {
      showCustomToast(
        "Sorry, we're not providing services in selected address",
        "warning"
      );
      return;
    }
    setShowCODLoading(true);
    try {
      const payload: PlaceCODOrderRequest = {
        facility_id: facilityId,
        user_id: Number(userInfo?.userId),
        mobile: collectionData.phoneNumber,
        user_address_id: collectionData.selectedAddress.id,
        sub_total: Number(orderTotal),
        discount: 0,
        tax_percentage: 0,
        total_amount: Number(orderTotal),
        payment_method: "COD",
        driver_notes: collectionData.driver_notes,
        payment_id: "",
        transaction_id: 0,
        facility_notes: collectionData.facility_notes,
        schedule: {
          pickup: {
            date: pickupDate,
            slot: collectionData.selectedSlot,
            time: collectionData.selectedSlotTime,
            collect_from_id: collectionData.schedule_collect_from.id,
          },
          drop: {
            date: dropDate,
            slot: collectionData.dropSlot,
            time: collectionData.dropSlotTime,
            collect_from_id: collectionData.drop_collect_from.id,
          },
        },

        items: cartItems.map((ci) => ({
          item_id: ci.item.item_id,
          amount: ci.item.item.price,
          quantity: ci.quantity,
          service_id: ci.itemId,
          category_id: ci.item.service_category_id,
        })),
      };

      const placeOrderResponse = await CreateCODOrderApi(payload);

      if (placeOrderResponse.status === 201 && placeOrderResponse.data.status) {
        navigation.navigate(MAIN_NAV_STRINGS.ORDER_SUCCESS as never, {
          orderId: placeOrderResponse.data.data.order_number,
        });
        queryClient.invalidateQueries({ queryKey: ["user_orders"] });
        setCartItems([]);
        setCollectionData({
          selectedAddress: {
            id: 0,
            user_id: 0,
            lat: 0,
            long: 0,
            default: 0,
            address: "",
            type: "",
            created_at: "",
          },
          scheduleDate: moment().toDate(),
          selectedSlot: "",
          selectedSlotTime: "",
          schedule_collect_from: { id: 0, from: "" },
          dropDate: moment().toDate(),
          dropSlot: "",
          dropSlotTime: "",
          drop_collect_from: { id: 0, from: "" },
          driver_notes: "",
          facility_notes: "",
          phoneNumber: "",
        });
      }
    } catch (error: any) {
      console.log({ error: error.message });
      showCustomToast(JSON.stringify(error), "danger");
    } finally {
      setShowCODLoading(false);
    }
  };
  const onPressCheckoutOnlineOrder = async () => {
    if (Number(facilityId) === 0) {
      showCustomToast(
        "Sorry, we're not providing services in selected address",
        "warning"
      );
      return;
    }
    setShowOnlineLoading(true);
    try {
      const payload: PlaceOnlineOrderRequest = {
        amount: grandTotal,
      };
      const placeOrderResponse = await CreateOnlineOrderApi(payload);

      if (placeOrderResponse.status === 200 && placeOrderResponse.data.status) {
        setPaymentData({
          paymentId: placeOrderResponse.data.data.payment_id,
          payment_transaction_id: 0,
        });
        navigation.navigate(MAIN_NAV_STRINGS.PAYMENT as never, {
          checkout_url: placeOrderResponse.data.data.checkout_url,
        });
      }
    } catch (error: any) {
      console.log({ error: error.message });
    } finally {
      setShowOnlineLoading(false);
    }
  };

  const pickupDate = useMemo(() => {
    if (collectionData.scheduleDate) {
      const date = moment(collectionData.scheduleDate).format("DD/MM/YYYY");
      return date;
    }
    return "";
  }, [collectionData.scheduleDate]);

  const dropDate = useMemo(() => {
    if (collectionData.dropDate) {
      const date = moment(collectionData.dropDate).format("DD/MM/YYYY");
      return date;
    }
    return "";
  }, [collectionData.dropDate]);

  const orderTotal = useMemo(() => {
    if (cartItems.length > 0) {
      let total = 0;
      cartItems.forEach((ci) => {
        total += ci.quantity * ci.item.item.price;
      });
      return total + "";
    }
    return "";
  }, [cartItems]);

  const minimumOrderCharge = useMemo(() => {
    return 0;
  }, []);
  const serviceFee = useMemo(() => {
    return 0;
  }, []);
  const discounts = useMemo(() => {
    return 0;
  }, []);

  const grandTotal = useMemo(() => {
    if (Number(orderTotal) > 0) {
      const totalDedections = minimumOrderCharge + serviceFee + discounts;
      const finalTotal = Number(orderTotal) - totalDedections;
      return finalTotal + "";
    }
    return "";
  }, [cartItems, minimumOrderCharge, discounts, serviceFee]);

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButttonContainer}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            size={SIZING.scaleWidth(7)}
            color={COLORS.WHITE}
            name="arrow-back"
          />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Order details!</Text>
          <Text style={styles.subHeaderText}>
            Safety sticker ensures your laundry remains untouched during the
            process."
          </Text>
        </View>

        <View style={styles.addressContainer}>
          <View>
            <Text style={styles.addressText}>
              {collectionData.selectedAddress.address}
            </Text>
          </View>
          <Image source={IMAGES.MAP_ICON} style={styles.mapIcon} />
        </View>
        <Divider />

        <View style={styles.deliveryWrapper}>
          <View style={styles.deliveryContainer}>
            <IonIcons
              name="call-outline"
              size={SIZING.scaleWidth(5)}
              color={COLORS.GRAY}
            />
            <Text style={styles.deliveryText}>
              Phone Number: {collectionData.phoneNumber}
            </Text>
          </View>
        </View>
        <View style={styles.deliveryWrapper}>
          <View style={styles.deliveryContainer}>
            <Image source={IMAGES.BUCKET_ICON} style={styles.bucketIcon} />
            <Text style={styles.deliveryText}>
              Picking up on {pickupDate}, {collectionData.selectedSlotTime}
            </Text>
          </View>
        </View>
        <View style={styles.deliveryWrapper}>
          <View style={styles.deliveryContainer}>
            <Image source={IMAGES.BUCKET_ICON} style={styles.bucketIcon} />
            <Text style={styles.deliveryText}>
              Delivered on {dropDate}, {collectionData.dropSlotTime}
            </Text>
          </View>
        </View>

        <Divider style={{ marginTop: SIZING.scaleHeight(1) }} />

        <Text style={styles.sectionTitle}>Items in order</Text>
        <FlatList
          data={cartItems}
          renderItem={({ item }) => {
            return (
              <View style={styles.itemContainer}>
                <Card style={styles.itemCard}>
                  <Card.Cover
                    source={{ uri: "https://via.placeholder.com/60" }}
                    style={styles.itemImage}
                  />
                </Card>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.item.item.name}</Text>
                  <Text style={styles.itemDetails}>
                    {item.quantity} Item | € {item.item.item.price}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  € {item.quantity * item.item.item.price}
                </Text>
              </View>
            );
          }}
        />

        {/* <TouchableOpacity style={styles.learnMoreButton}>
          <Image source={IMAGES.LIST_ICON} style={styles.bucketIcon} />
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity> */}
        <Divider style={{ marginTop: SIZING.scaleHeight(2) }} />

        <View style={styles.orderTotalContainer}>
          <Text style={styles.orderTotalText}>Order Total</Text>
          <Text style={styles.orderTotalAmount}>€ {grandTotal}</Text>
        </View>

        <Divider />

        <Button
          mode="contained"
          style={styles.howItWorksButton}
          textColor={COLORS.PRIMARY}
          icon={IMAGES.LIST_ICON}
          onPress={() => navigation.navigate(MAIN_NAV_STRINGS.FAQ as never)}
        >
          How it works
        </Button>

        <Divider />

        {/* Charges Breakdown */}
        <View style={styles.breakdownContainer}>
          <BreakdownItem
            label="Minimum Order Charge"
            amount={`€ ${minimumOrderCharge}`}
          />
          <BreakdownItem label="Service Fee" amount={`€ ${serviceFee}`} />
          <BreakdownItem label="Discounts" amount={`€ ${discounts}`} />
          <BreakdownItem label="Final Total" amount={`€ ${grandTotal}`} bold />
        </View>

        <OrderButton
          onPress={onPressCheckoutCODOrder}
          title="Checkout Order (COD)"
          loading={showCODLoading}
        />
        <OrderButton
          onPress={onPressCheckoutOnlineOrder}
          title="Checkout Order (Online)"
          loading={showOnlineLoading}
        />
      </ScrollView>
      <FullScreenLoader
        isLoading={paymentLoading}
        text={`please wait\n while we're are verifying the payment`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    backgroundColor: "#FFFBEA",
    padding: SIZING.scaleWidth(4),
    borderRadius: SIZING.scaleWidth(2),
    marginTop: SIZING.scaleHeight(1),
  },
  headerText: {
    fontSize: SIZING.scaleFont(4),
    fontFamily: FONTS.PoppinsSemiBold,
    color: "#0C2638",
  },
  subHeaderText: {
    fontSize: SIZING.scaleFont(3.2),
    fontFamily: FONTS.PoppinsRegular,
    color: "#0C2638",
    marginTop: SIZING.scaleHeight(1),
    width: SIZING.scaleWidth(80),
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZING.scaleHeight(3),
    marginBottom: SIZING.scaleHeight(2),
    marginHorizontal: SIZING.scaleWidth(5),
  },
  addressText: {
    fontSize: SIZING.scaleFont(4),
    width: SIZING.scaleWidth(78),
    fontFamily: FONTS.PoppinsMedium,
    color: "#0C2638",
  },
  pinText: {
    fontSize: SIZING.scaleFont(3.2),
    fontFamily: FONTS.PoppinsRegular,
    color: "#666",
    marginTop: SIZING.scaleHeight(1),
  },
  deliveryWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SIZING.scaleHeight(1),
    marginHorizontal: SIZING.scaleWidth(5),
  },
  deliveryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: SIZING.scaleFont(3.5),
    color: "#666",
    fontFamily: FONTS.PoppinsRegular,
    marginHorizontal: SIZING.scaleWidth(2),
  },
  bucketIcon: {
    width: SIZING.scaleWidth(5),
    height: SIZING.scaleHeight(5),
    resizeMode: "contain",
  },
  sectionTitle: {
    fontSize: SIZING.scaleFont(4),
    fontFamily: FONTS.PoppinsSemiBold,
    marginVertical: SIZING.scaleHeight(1),
    marginHorizontal: SIZING.scaleWidth(5),
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SIZING.scaleWidth(5),
    paddingVertical: SIZING.scaleHeight(1),
  },
  itemCard: {
    borderRadius: SIZING.scaleWidth(2),
    overflow: "hidden",
  },
  itemImage: {
    width: SIZING.scaleWidth(10),
    height: SIZING.scaleHeight(5),
    resizeMode: "contain",
  },
  itemInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  itemTitle: {
    fontSize: SIZING.scaleFont(4),
    fontFamily: FONTS.PoppinsSemiBold,
    color: "#0C2638",
  },
  itemDetails: {
    fontSize: SIZING.scaleFont(3.2),
    fontFamily: FONTS.PoppinsRegular,
    color: "#666",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  learnMoreButton: {
    marginTop: SIZING.scaleHeight(1),
    paddingHorizontal: SIZING.scaleWidth(17),
    flexDirection: "row",
    alignItems: "center",
  },
  learnMoreText: {
    color: "#1E88E5",
    fontSize: SIZING.scaleFont(3.5),
    marginLeft: SIZING.scaleWidth(2),
  },
  orderTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: SIZING.scaleHeight(1.5),
    marginHorizontal: SIZING.scaleWidth(5),
  },
  orderTotalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderTotalAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  howItWorksButton: {
    backgroundColor: "#09467222",
    marginVertical: SIZING.scaleHeight(2),
    width: SIZING.scaleWidth(40),
    borderRadius: SIZING.scaleWidth(2),
    marginLeft: SIZING.scaleWidth(5),
  },
  breakdownContainer: {
    marginVertical: SIZING.scaleHeight(2),
    marginHorizontal: SIZING.scaleWidth(5),
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontSize: SIZING.scaleFont(3.5),
    color: "#0C2638",
    fontFamily: FONTS.PoppinsRegular,
  },
  boldText: {
    fontFamily: FONTS.Inter18Bold,
  },
  backButttonContainer: {
    backgroundColor: COLORS.GRAY,
    borderRadius: SIZING.scaleWidth(2),
    width: SIZING.scaleWidth(10),
    marginLeft: SIZING.scaleWidth(5),
    paddingVertical: SIZING.scaleHeight(0.7),
    alignItems: "center",
    marginTop: SIZING.scaleHeight(5),
  },
  mapIcon: {
    height: SIZING.scaleHeight(10),
    width: SIZING.scaleWidth(10),
    resizeMode: "contain",
  },
});
