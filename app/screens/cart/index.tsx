import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import IonIcons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import { useAtomValue, useSetAtom } from "jotai";
import { cartItemsAtoms, collectionAndDeliveryAtom } from "../../store";
import { ServiceItemsType } from "../../customTypes/home";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { OrderButton } from "../../components";
import { MAIN_NAV_STRINGS, TAB_STRINGS } from "../../navigation/constants";
import moment from "moment";

interface listItemType {
  itemId: number;
  quantity: number;
  item: ServiceItemsType;
}
const CartList = () => {
  const setCartItems = useSetAtom(cartItemsAtoms);
  const setCollectionData = useSetAtom(collectionAndDeliveryAtom);

  useFocusEffect(
    useCallback(() => {
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
    }, [setCollectionData])
  );

  const Header = () => {
    const navigation = useNavigation();
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
        >
          <IonIcons
            name="chevron-back-outline"
            color={COLORS.BLACK}
            size={SIZING.scaleWidth(8)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate(TAB_STRINGS.ACCOUNT as never);
          }}
        >
          <IonIcons
            name="person-circle"
            color={COLORS.GRAY}
            size={SIZING.scaleWidth(8)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const OrderListItem = ({ item }: { item: listItemType }) => {
    const totalPrice = useMemo(() => {
      return item.item.item.price * item.quantity;
    }, [item.item.item.price, item.quantity]);

    const onPressDecrement = () => {
      if (item.quantity > 1) {
        setCartItems((prev) => {
          const oldData = [...prev];
          const index = oldData.findIndex((i) => i.itemId === item.itemId);

          if (index > -1) {
            oldData[index].quantity = oldData[index].quantity - 1;
          }
          return oldData;
        });
      }
    };

    const onPressIncrement = () => {
      setCartItems((prev) => {
        const oldData = [...prev];
        const index = oldData.findIndex((i) => i.itemId === item.itemId);

        if (index > -1) {
          oldData[index].quantity = oldData[index].quantity + 1;
        }
        return oldData;
      });
    };

    return (
      <View style={styles.rowFront}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.item.item.name}</Text>
          <Text style={styles.unitPrice}>${item.item.item.price} / Item</Text>
          <Text style={styles.price}>$ {totalPrice}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={onPressDecrement}
            activeOpacity={0.5}
          >
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.quantityButton}
            onPress={onPressIncrement}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: listItemType }) => (
    <OrderListItem item={item} />
  );

  const cartItems = useAtomValue(cartItemsAtoms);
  const navigation = useNavigation();

  const onClickDelete = (indexToRemove: number) => {
    const orderIdAtIndex = cartItems[indexToRemove].itemId;
    const newOrders = cartItems.filter(
      (order) => order.itemId !== orderIdAtIndex
    );
    setCartItems(newOrders);
  };

  const renderHiddenItem = ({ index, item }: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onClickDelete(index)}
      >
        <MaterialIcons name="delete" size={24} color={COLORS.BLACK} />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <Header />
      <StatusBar
        animated
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
      />
      <Text style={styles.heading}>Cart List</Text>

      <SwipeListView
        data={cartItems}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe
        keyExtractor={(item) => item.itemId + ""}
        contentContainerStyle={styles.listContainer}
      />
      <OrderButton
        title="next"
        disabled={cartItems.length < 1}
        loading={false}
        onPress={() => {
          navigation.navigate(MAIN_NAV_STRINGS.PICK_COLLECT_SCREEN as never);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SIZING.scaleHeight(6),
  },
  listContainer: {
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  rowFront: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BLACK,
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SIZING.scaleWidth(25),
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: SIZING.scaleWidth(1.5),
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 18,
    color: "#000",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  deleteButton: {
    width: 60,
    height: "100%",
    backgroundColor: "#0946723B",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  /* header styles starts */
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZING.scaleWidth(2),
    paddingHorizontal: SIZING.scaleWidth(2),
  },
  /* header styles ends */
  heading: {
    marginLeft: SIZING.scaleWidth(4),
    marginVertical: SIZING.scaleHeight(1),
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4.5),
    color: COLORS.BLACK,
  },
});

export default CartList;
