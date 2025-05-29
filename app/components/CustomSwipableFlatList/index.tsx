import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import { ServiceItemsType } from "../../customTypes/home";
import { IMAGES } from "../../assets/images";

interface listItemType {
  order_id?: number;
  cust_name?: string;
  cust_addr?: object;
  quantity?: number;
  itemId?: number;
  item?: ServiceItemsType;
}

const OrderListItem = ({ item }: { item: listItemType }) => {
  return (
    <View style={styles.rowFront}>
      <Image source={IMAGES.BUCKET_ICON} style={styles.bucketIcon} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>
          {item?.cust_name ? item?.cust_name : item?.item?.item?.name}
        </Text>
        <Text style={styles.unitPrice}>${2} / Item</Text>
        <Text style={styles.price}>$ {10}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton}>
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity style={styles.quantityButton}>
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CustomSwipableFlatList = (props: any) => {
  const renderItem = ({ item }: { item: listItemType }) => (
    <OrderListItem item={item} />
  );

  const renderHiddenItem = ({ index, item }: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => props.onClickDelete(index)}
      >
        <MaterialIcons name="delete" size={24} color={COLORS.BLACK} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar animated barStyle={"dark-content"} />
      <Text style={styles.heading}>{props.title}</Text>

      <SwipeListView
        data={props.listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe
        keyExtractor={(item) => item.itemId + ""}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  itemDetails: {
    flex: 1,
    marginLeft: SIZING.scaleWidth(7),
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

    backgroundColor: "#0946723B",
    flexDirection: "row",
    position: "absolute",
    right: 0,
    height: SIZING.scaleHeight(17),
    width: 60,
    justifyContent: "center",
    paddingRight: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginLeft: 10,
  },
  heading: {
    marginLeft: SIZING.scaleWidth(4),
    marginVertical: SIZING.scaleHeight(1),
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4.5),
    color: COLORS.BLACK,
  },
  bucketIcon: {
    width: SIZING.scaleWidth(15),
    height: SIZING.scaleHeight(15),
    resizeMode: "contain",
  },
});

export default CustomSwipableFlatList;
