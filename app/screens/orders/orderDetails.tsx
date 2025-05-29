import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Card, Button, Divider, IconButton } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import { IMAGES } from "../../assets/images";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { UserOrdersType } from "../../customTypes/home";
import { CancelOrderModal } from "../../components";

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

export default function OrderDetails({ route }) {
  const { item } = route.params;
  const orderItem: UserOrdersType = item ? JSON.parse(item as string) : {};

  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const pickupDate = useMemo(() => {
    if (orderItem?.schedule?.pickup_date) {
      const date = moment(orderItem.schedule.pickup_date, "YYYY-DD-MM").format(
        "DD/MM/YYYY"
      );
      return date;
    }
    return "";
  }, [orderItem?.schedule?.pickup_date]);

  const pickupTime = useMemo(() => {
    if (orderItem?.schedule?.pickup_time) {
      const date = moment(orderItem.schedule.pickup_time, "HH:mm:ss").format(
        "HH:mm A"
      );
      return date;
    }
    return "";
  }, [orderItem?.schedule?.pickup_time]);

  const dropDate = useMemo(() => {
    if (orderItem?.schedule?.drop_date) {
      const date = moment(orderItem.schedule.drop_date, "YYYY-DD-MM").format(
        "DD/MM/YYYY"
      );
      return date;
    }
    return "";
  }, [orderItem?.schedule?.drop_date]);

  const dropTime = useMemo(() => {
    if (orderItem?.schedule?.drop_time) {
      const date = moment(orderItem.schedule.drop_time, "HH:mm:ss").format(
        "HH:mm A"
      );
      return date;
    }
    return "";
  }, [orderItem?.schedule?.drop_time]);

  return (
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.statusText}>
            Status: {orderItem.current_status.title}
          </Text>
        </View>
      </View>

      <View style={styles.addressContainer}>
        <View>
          <Text style={styles.addressText}>
            {orderItem?.order_user_address?.address}
          </Text>
        </View>
        <IconButton icon="map-marker-outline" size={24} />
      </View>
      <Divider />

      <View style={styles.deliveryWrapper}>
        <View style={styles.deliveryContainer}>
          <Image source={IMAGES.BUCKET_ICON} style={styles.bucketIcon} />
          <Text style={styles.deliveryText}>
            Picking up on {pickupDate}, {pickupTime}
          </Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={SIZING.scaleWidth(6)}
          color="#666"
        />
      </View>
      <View style={styles.deliveryWrapper}>
        <View style={styles.deliveryContainer}>
          <Image source={IMAGES.BUCKET_ICON} style={styles.bucketIcon} />
          <Text style={styles.deliveryText}>
            Delivered on {dropDate}, {dropTime}
          </Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={SIZING.scaleWidth(6)}
          color="#666"
        />
      </View>

      <Divider style={{ marginTop: SIZING.scaleHeight(1) }} />

      <Text style={styles.sectionTitle}>Items in order</Text>
      <FlatList
        data={orderItem.items}
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
                <Text style={styles.itemTitle}>{item?.item?.name}</Text>
                <Text style={styles.itemDetails}>
                  {item.quantity} Item | {item?.item?.price} €
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                {item.quantity * item?.item?.price} €
              </Text>
            </View>
          );
        }}
      />

      <Divider />

      <View style={styles.orderTotalContainer}>
        <Text style={styles.orderTotalText}>Order Total</Text>
        <Text style={styles.orderTotalAmount}>{orderItem.sub_total} €</Text>
      </View>

      <Divider />

      <Button
        mode="contained"
        style={styles.howItWorksButton}
        textColor={COLORS.PRIMARY}
        icon={IMAGES.LIST_ICON}
      >
        How it works
      </Button>

      <Divider />

      {/* Charges Breakdown */}
      <View style={styles.breakdownContainer}>
        <BreakdownItem label="Minimum Order Charge" amount={`0 €`} />
        <BreakdownItem label="Service Fee" amount={`0 €`} />
        <BreakdownItem label="Discounts" amount={`${orderItem.discount} €`} />
        <BreakdownItem
          label="Final Total"
          amount={`€ ${orderItem.grand_total}`}
          bold
        />
      </View>
      <TouchableOpacity
        style={styles.cancelOrderContainer}
        activeOpacity={0.8}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.cancelOrderText}>Cancel Order</Text>
      </TouchableOpacity>
      <CancelOrderModal
        isModalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        orderId={orderItem.order_number}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: SIZING.scaleHeight(1),
  },
  header: {
    backgroundColor: "#FFFBEA",
    padding: SIZING.scaleHeight(2),
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
    width: SIZING.scaleWidth(50),
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
    marginTop: SIZING.scaleHeight(3),
  },
  cancelOrderContainer: {
    backgroundColor: COLORS.PRIMARY,
    marginBottom: SIZING.scaleWidth(5),
    marginHorizontal: SIZING.scaleWidth(30),
    borderRadius: SIZING.scaleWidth(2),
    paddingVertical: SIZING.scaleHeight(1),
  },
  cancelOrderText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
    textAlign: "center",
    textTransform: "uppercase",
  },
  statusText: {
    textAlign: "center",
  },
});
