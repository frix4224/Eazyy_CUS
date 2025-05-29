import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  LogBox,
} from "react-native";
import { IMAGES } from "../../assets/images";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import { ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { ServicesType } from "../../services/types/home";
import { IMAGE_BASE_URL } from "@env";
import { ServiceItemsType } from "../../customTypes/home";
import { EmptyList } from "../../components";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { cartItemsAtoms, serviceItemsAtoms, tabCartAtom } from "../../store";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

LogBox.ignoreAllLogs();
const RenderAllService = ({ item }: { item: ServiceItemsType }) => {
  const [cartItems, setCartItems] = useAtom(cartItemsAtoms);
  const showAddButton = useMemo(() => {
    const findIndex = cartItems.findIndex((ci) => item.id === ci.itemId);

    if (findIndex > -1) {
      return false;
    }
    return true;
  }, [cartItems, item.id]);

  const cartItemQuantity = useMemo(() => {
    if (cartItems.length > 0) {
      const findIndex = cartItems.findIndex((ci) => item.id === ci.itemId);
      if (findIndex > -1) {
        return cartItems[findIndex].quantity;
      }
    }
  }, [cartItems, item.id]);

  const onPressDecrement = () => {
    setCartItems((prev) => {
      const oldData = [...prev];
      const index = oldData.findIndex((i) => i.itemId === item.id);

      if (index > -1) {
        if (oldData[index].quantity < 2) {
          return oldData.filter((od) => od.itemId !== item.id);
        }
        oldData[index].quantity = oldData[index].quantity - 1;
      }
      return oldData;
    });
  };

  const onPressIncrement = () => {
    setCartItems((prev) => {
      const oldData = [...prev];
      const index = oldData.findIndex((i) => i.itemId === item.id);

      if (index > -1) {
        oldData[index].quantity = oldData[index].quantity + 1;
      }
      return oldData;
    });
  };

  return (
    <View style={styles.serviceAllInnerContainer} key={item.id}>
      <View>
        <Text style={styles.listNameText}>{item?.item?.name}</Text>
        <Text style={styles.listDescriptionTex}>{item?.item?.description}</Text>
        <Text style={styles.listPrice}>
          {item?.item?.price} ({item?.item?.unit})
        </Text>
      </View>
      {showAddButton ? (
        <TouchableOpacity
          style={styles.addButtonContainer}
          activeOpacity={0.5}
          onPress={() => {
            setCartItems((prev) => {
              const oldData = [...prev];
              const index = oldData.findIndex((i) => i.itemId === item.id);
              if (index > -1) {
                oldData[index].quantity += 1;
              } else {
                oldData.push({ quantity: 1, itemId: item.id, item: item });
              }
              return oldData;
            });
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.counterWrapper}>
          <TouchableOpacity
            style={styles.counterContainer}
            activeOpacity={0.5}
            onPress={onPressDecrement}
          >
            <Text style={styles.counterControlText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValueText}>{cartItemQuantity}</Text>
          <TouchableOpacity
            style={styles.counterContainer}
            activeOpacity={0.5}
            onPress={onPressIncrement}
          >
            <Text style={styles.counterControlText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const RenderItem = ({
  item,
  activeCategory,
  setActiveCategory,
}: {
  item: {
    categoryName: string;
    categoryImage: string;
  };
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      disabled={activeCategory === item.categoryName}
      activeOpacity={0.5}
      onPress={() => {
        if (activeCategory === item.categoryName) {
          return false;
        }
        setActiveCategory(item.categoryName);
      }}
    >
      <Image
        source={{ uri: IMAGE_BASE_URL + item.categoryImage }}
        style={{
          width: SIZING.scaleWidth(15),
          height: SIZING.scaleHeight(6),
          resizeMode: "contain",
        }}
      />
      <Text
        style={{
          textAlign: "center",
          fontFamily: FONTS.PoppinsSemiBold,
          fontSize: SIZING.scaleFont(3.2),
          marginTop: SIZING.scaleHeight(0.5),
          color: COLORS.BLACK,
          opacity: activeCategory === item.categoryName ? 1 : 0.5,
        }}
      >
        {item.categoryName}
      </Text>
    </TouchableOpacity>
  );
};
const ServiceOverview = ({ route }: any) => {
  const navigation = useNavigation();
  const services :any= useAtomValue(serviceItemsAtoms);
  const setTabCartIcon = useSetAtom(tabCartAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtoms);
  const [serviceCategories, setServiceCategories] = useState<
    {
      categoryName: string;
      categoryImage: string;
    }[]
  >([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [items, setItems] = useState<ServiceItemsType[]>();
  const activeService: string = useMemo(() => {
    if (route.params && route.params?.activeService.length > 0) {
      return JSON.parse(route.params?.activeService);
    }
    return "";
  }, [route.params?.activeService]);


  useEffect(() => {
    let data =[];
    if (services?.length>0) {
      const filteredServices = services.filter(
        (service:any) => service?.service_categories[0]?.category.name === 'Shirts'
      );

      if (filteredServices.length > 0) {
        data = filteredServices[0].service_categories.map((sc:any) => ({
          categoryName: sc.category.name,
          categoryImage: sc.category.image,
        }));
      }
        setServiceCategories(data);
       // setServiceCategories(services[0]?.service_categories[0]?.category);
        setActiveCategory(services[0]?.service_categories[0]?.category?.name);
        setValue(services[0]);
        

      setItems(services[0]?.service_categories[0]?.items);
      }
    
  }, [services]);

  useEffect(() => {
    if (activeService) {
      const filteredServices = services.filter(
        (service:any) => service.name === activeService
      );

      if (filteredServices.length > 0) {
        const data = filteredServices[0].service_categories.map((sc:any) => ({
          categoryName: sc.category.name,
          categoryImage: sc.category.image,
        }));
        setServiceCategories(data);
        setActiveCategory(data[0].categoryName);
        setValue(filteredServices[0]);
      }
    }
  }, [activeService]);

  useEffect(() => {
    if (activeCategory) {
      const data =
        value?.service_categories.find(
          (category) => category.category.name === activeCategory
        )?.items || [];

      setItems(data);
    }
  }, [activeCategory]);

  const [value, setValue] = useState<ServicesType>();

  return (
    <ImageBackground
      source={IMAGES.OFFER_ONE}
      style={styles.bgContainer}
      resizeMode="cover"
    >
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
      <StatusBar
        animated
        barStyle={"light-content"}
        translucent
        networkActivityIndicatorVisible
        backgroundColor={"transparent"}
      />
      <View style={styles.headingContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconColor={COLORS.WHITE}
          data={services}
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder={"Select a service"}
          value={value}
          onChange={(item) => {
            setValue(item);
            const data = item.service_categories.map((sc) => ({
              categoryName: sc.category.name,
              categoryImage: sc.category.image,
            }));
            setActiveCategory(data[0]?.categoryName);
            setServiceCategories(data);
            const itemsData =
              item.service_categories.find(
                (category) => category.category.name === activeCategory
              )?.items || [];

            setItems(itemsData);
          }}
        />
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.serviceDetailContainer}>
          <FlatList
            data={serviceCategories}
            renderItem={({ item }) => (
              <RenderItem
                item={item}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            )}
            keyExtractor={(item: any) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContainer,
              {
                justifyContent:
                  serviceCategories.length > 3 ? "space-between" : "flex-start",
              },
            ]}
            nestedScrollEnabled={true}
          />
          {items && items?.length > 0 ? (
            <View style={styles.secondConatiner}>
              <FlatList
                data={items}
                renderItem={({ item }) => <RenderAllService item={item} />}
                keyExtractor={(item: any) => item.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.serviceAllListContainer}
                nestedScrollEnabled={true}
              />
            </View>
          ) : (
            <EmptyList />
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ServiceOverview;

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    height: SIZING.scaleHeight(20),
    width: SIZING.scaleWidth(105),
    paddingTop: SIZING.scaleHeight(2),
    backgroundColor: COLORS.WHITE,
  },
  headingContainer: {
    marginTop: SIZING.scaleHeight(2),
    marginHorizontal: SIZING.scaleWidth(5),
  },
  secondConatiner: {},
  serviceDetailContainer: {
    marginTop: SIZING.scaleHeight(1),
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: SIZING.scaleWidth(7),
    borderTopRightRadius: SIZING.scaleWidth(7),
    width: SIZING.scaleWidth(100),
    paddingBottom: SIZING.scaleHeight(5),
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(3),
    height: SIZING.scaleHeight(15),
    alignItems: "center",
    justifyContent: "space-between",
    width: SIZING.scaleWidth(100),
  },
  container: {
    height: SIZING.scaleHeight(12),
    alignItems: "center",
  },
  listDescriptionTex: {
    width: SIZING.scaleWidth(55),
    marginBottom: SIZING.scaleHeight(0.5),
  },
  listNameText: {
    width: SIZING.scaleWidth(55),
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsBold,
    fontSize: SIZING.scaleFont(4),
  },
  listPrice: {
    color: COLORS.PRICE,
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.5),
  },
  serviceAllListContainer: {},
  addButtonContainer: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SIZING.scaleWidth(7),
    paddingVertical: SIZING.scaleHeight(1),
    borderRadius: SIZING.scaleWidth(3),
  },
  addButtonText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.PoppinsBold,
    fontSize: SIZING.scaleFont(4),
  },

  serviceAllInnerContainer: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SIZING.scaleWidth(5),
    paddingVertical: SIZING.scaleHeight(2),
    borderRadius: SIZING.scaleWidth(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: SIZING.scaleHeight(2),
    marginHorizontal: SIZING.scaleWidth(5),
  },
  counterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: COLORS.PRIMARY,
    borderWidth: SIZING.scaleWidth(0.2),
    borderRadius: SIZING.scaleWidth(2),
    paddingHorizontal: SIZING.scaleWidth(3),
    paddingTop: SIZING.scaleHeight(0.5),
    width: SIZING.scaleWidth(23),
  },
  counterContainer: {},
  counterControlText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(5),
    color: COLORS.BLACK,
  },
  counterValueText: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4.5),
    color: COLORS.PRIMARY,
  },
  /* dropdown styles start */
  dropdown: {
    height: SIZING.scaleHeight(5),
    width: SIZING.scaleWidth(85),
    borderColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    color: COLORS.WHITE,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
  },
  placeholderStyle: {
    color: COLORS.WHITE,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
  },
  selectedTextStyle: {
    fontSize: SIZING.scaleFont(4),
    fontFamily: FONTS.PoppinsMedium,
    color: COLORS.WHITE,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  /* dropdown styles end */
  backButttonContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZING.scaleWidth(2),
    opacity: 0.5,
    marginTop: SIZING.scaleHeight(5),
    width: SIZING.scaleWidth(10),
    marginLeft: SIZING.scaleWidth(5),
    paddingVertical: SIZING.scaleHeight(0.7),
    alignItems: "center",
  },
});
