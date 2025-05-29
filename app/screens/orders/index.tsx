import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FetchUserOrdersApi } from "../../services/methods/home";
import { COLORS, SIZING } from "../../utils";
import { UserOrdersType } from "../../customTypes/home";
import { FONTS } from "../../assets/fonts";
import { useNavigation } from "@react-navigation/native";
import { MAIN_NAV_STRINGS } from "../../navigation/constants";
import moment from "moment";

const OrderListItem = ({ item }: { item: UserOrdersType }) => {
  const navigation = useNavigation();
  const orderDate = useMemo(() => {
    if (item.created_at) {
      return moment.utc(item.created_at).format("DD-MMM-YYYY HH:mm A");
    }
    return "";
  }, [item.created_at]);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.rowFront}
      onPress={() =>
        navigation.navigate(MAIN_NAV_STRINGS.ORDER_DETAILS as never, {
          item: JSON.stringify(item),
        })
      }
    >
      <View />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>
          #{item?.order_number} ({orderDate})
        </Text>
        <Text style={styles.unitPrice}>Total items: {item.items.length}</Text>
        <Text style={styles.price}>Total Price: {item.sub_total}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.statusText}>{item?.current_status?.title}</Text>
      </View>
    </TouchableOpacity>
  );
};
const OrdersScreen = () => {
  const [orderListData, setOrderListData] = useState<UserOrdersType[]>([]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["user_orders"],
    queryFn: FetchUserOrdersApi,
  });

  useEffect(() => {
    if (orders?.status === 200 && orders.data.status) {
      setOrderListData(orders.data.data);
    }
  }, [orders]);

  const renderItem = ({ item }: { item: UserOrdersType }) => (
    <OrderListItem item={item} />
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        animated
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
      />
      <Text style={styles.heading}>Order List</Text>

      {isLoading ? (
        <ActivityIndicator color={COLORS.PRIMARY} size={"large"} />
      ) : (
        <FlatList
          data={orderListData}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No orders found!</Text>
          }
          keyExtractor={(item) => item.id + ""}
          contentContainerStyle={[
            styles.listContainer,
            { backgroundColor: orderListData.length > 0 ? "#F5F5F5" : "" },
          ]}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SIZING.scaleHeight(6),
  },
  listContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
    paddingBottom: SIZING.scaleHeight(12),
  },
  rowFront: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    paddingLeft: SIZING.scaleWidth(0),
    marginBottom: 16,
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: SIZING.scaleWidth(4),
  },
  itemName: {
    fontSize: SIZING.scaleFont(3.9),
    fontWeight: "600",
    color: COLORS.BLACK,
    width: SIZING.scaleWidth(61),
  },
  unitPrice: {
    fontSize: 12,
    color: "#888",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BLACK,
  },
  heading: {
    marginLeft: SIZING.scaleWidth(4),
    marginVertical: SIZING.scaleHeight(1),
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4.5),
    color: COLORS.BLACK,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyListText: {
    textAlign: "center",
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(5),
    color: COLORS.BLACK,
  },
  statusText: {
    width: SIZING.scaleWidth(22),
    textAlign: "center",
  },
});

export default OrdersScreen;
