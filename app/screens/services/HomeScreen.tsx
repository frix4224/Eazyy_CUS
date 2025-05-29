// @ts-nocheck

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
  useWindowDimensions,
  Dimensions,
  Animated,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import {
  FilterComponent,
  IMAGES,
  NotificationComponent,
  SearchComponent,
} from "../../assets/images";
import TopComponent from "../../assets/images/TopComponent";
import BottomComponent from "../../assets/images/BottomComponent";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { userAtom } from "../../store/auth";
import { useQuery } from "@tanstack/react-query";
import { FetchHomeServices } from "../../services/methods/home";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import { ServiceItems, ServicesType } from "../../services/types/home";
import { useNavigation } from "@react-navigation/native";
import {
  MAIN_NAV_STRINGS,
  TAB_HOME_STACK_STRINGS,
} from "../../navigation/constants";
import { IMAGE_BASE_URL } from "@env";
import { EmptyList } from "../../components";
import { serviceItemsAtoms, tabCartAtom } from "../../store";
import IonIcons from 'react-native-vector-icons/Ionicons'; // Import IonIcons

const OffersData = [
  {
    id: 1,
    heading: "25% OFF*",
    title: "Free 24H delivery",
    description: "Get a Discount for Every \n Order only Valid for Today!",
    image: IMAGES.OFFER_ONE,
  },
  {
    id: 2,
    heading: "25% OFF*",
    title: "Free 24H delivery",
    description: "Get a Discount for Every \n Order only Valid for Today!",
    image: IMAGES.OFFER_TWO,
  },
  {
    id: 3,
    heading: "25% OFF*",
    title: "Free 24H delivery",
    description: "Get a Discount for Every \n Order only Valid for Today!",
    image: IMAGES.OFFER_THREE,
  },
];

interface CategoryButtonProps {
  title: string;
  active?: boolean;
  onPress: () => void;
  icon: string;
}

const TopIcon = () => <TopComponent />;

const BottomIcon = () => <BottomComponent />;

const CategoryButton: React.FC<CategoryButtonProps> = ({
  title,
  active = false,
  icon,
  onPress,
}) => {
  const url = IMAGE_BASE_URL + icon;

  return (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        active ? styles.activeCategoryButton : styles.inactiveCategoryButton,
      ]}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: url }}
          style={[
            styles.icon,
            {
              backgroundColor: active ? COLORS.PRIMARY : COLORS.WHITE,
              tintColor: active ? COLORS.WHITE : COLORS.PRIMARY,
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.categoryButtonText,
          active
            ? styles.activeCategoryButtonText
            : styles.inactiveCategoryButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
const CarouselItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <ImageBackground
      source={item.image}
      style={styles.imageBackground}
      imageStyle={styles.image}
    >
      <View style={styles.overlay} />
      <View style={styles.textContainer}>
        <Text style={styles.promoTitle}>{item.heading}</Text>
        <Text style={styles.promoSubtitle}>{item.title}</Text>
        <Text style={styles.promoDescription}>{item.description}</Text>
      </View>
    </ImageBackground>
  </View>
);
const ServiceCarouselItem = ({ item }) => (
  <View style={[styles.itemContainer, { width: width * 0.65 }]}>
    <ImageBackground
      source={item.image}
      style={styles.imageBackground}
      imageStyle={styles.image}
    >
      <View style={styles.textContainer}>
        <Text style={styles.promoTitle}>{item.heading}</Text>
        <Text style={styles.promoSubtitle}>{item.title}</Text>
        <Text style={styles.promoDescription}>{item.description}</Text>
      </View>
    </ImageBackground>
  </View>
);
const { height, width } = Dimensions.get("window");
const ServiceCard = ({ title, price, location, imageSource }) => (
  <View style={styles.card}>
    {/* <Image source={imageSource} style={styles.image} /> */}
    <View style={styles.content}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.location}>{location}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>${price}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
const EmptyCategoriesItem = () => {
  return (
    <View style={styles.emptyCategoriesItem}>
      <Text style={styles.emptyCategoriesText}>No items found.</Text>
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const [services, setServices] = useAtom(serviceItemsAtoms);
  const [activeService, setActiveService] = useState("");
  const [serviceCategories, setServiceCategories] = useState<
    {
      categoryName: string;
      categoryImage: string;
    }[]
  >([]);
  const { width } = useWindowDimensions();
  const { data: servicesData, isFetching } = useQuery({
    queryKey: ["services"],
    queryFn: () => FetchHomeServices(),
  });
  const setTabCartIcon = useSetAtom(tabCartAtom);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  useEffect(() => {
    if (servicesData?.status === 200 && servicesData.data.status) {
      setActiveService(servicesData.data.data.services[0].name);
      const data = servicesData.data.data.services[0].service_categories.map(
        (sc) => ({
          categoryName: sc.category.name,
          categoryImage: sc.category.image,
        })
      );
      setServices(servicesData.data.data.services);
      setServiceCategories(data);
    }
  }, [servicesData]);

  const userInfoAtom = useAtomValue(userAtom);

  const ListItem = ({
    item,
  }: {
    item: { categoryName: string; categoryImage: string };
  }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(TAB_HOME_STACK_STRINGS.SERVICE_OVERVIEW, {
          activeService: JSON.stringify(activeService),
        });
        setTabCartIcon("show");
      }}
      activeOpacity={0.5}
      style={{
        marginRight: 16,
        borderRadius: 12,
      }}
    >
      <ImageBackground
        source={{ uri: IMAGE_BASE_URL + item.categoryImage }}
        style={{
          width: SIZING.scaleWidth(60),
          height: SIZING.scaleHeight(20),
        }}
        imageStyle={[
          styles.imageStyle,
          {
            width: SIZING.scaleWidth(60),
            height: SIZING.scaleHeight(20),
          },
        ]}
      >
        {/* Inner shadow effect */}
        <View style={styles.innerShadow} />

        {/* Icon and content */}
        <View style={styles.content}>
          <View style={{ marginTop: SIZING.scaleHeight(13) }}>
            <Text style={styles.title}>{item.categoryName}</Text>
            {/* <Text style={styles.price}>$ {item.item.price}</Text> */}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        animated
        barStyle={"dark-content"}
        translucent
        backgroundColor={"transparent"}
      />
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome back, {userInfoAtom?.name}!
            </Text>
            <Text style={styles.subText}>
              Let's keep your clothes fresh and clean.
            </Text>
          </View>
          {/* <TouchableOpacity>
            <NotificationComponent />
          </TouchableOpacity> */}
        </View>

        <FlatList
          data={OffersData}
          renderItem={({ item }) => <CarouselItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToInterval={width * 0.8 + 16} // Adjust spacing between items
          contentContainerStyle={styles.carouselContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
        <View style={styles.paginationContainer}>
          {OffersData.map((_, index) => {
            const inputRange = [
              (index - 1) * (width * 0.8 + 16),
              index * (width * 0.8 + 16),
              (index + 1) * (width * 0.8 + 16),
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 12, 8],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    width: dotWidth,
                    opacity,
                    backgroundColor: COLORS.PRIMARY,
                  },
                ]}
              />
            );
          })}
        </View>

        <View style={styles.categoryBox}>
          <Text style={styles.categoriesTitle}>Services</Text>
          {isFetching ? (
            <ActivityIndicator color={COLORS.PRIMARY} size={"large"} />
          ) : (
            <>
              <FlatList
                data={services}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  return (
                    <CategoryButton
                      title={item.name}
                      icon={item.icon}
                      active={activeService === item.name}
                      onPress={() => {
                        setActiveService(item.name);
                        const data = item.service_categories.map((sc) => ({
                          categoryName: sc.category.name,
                          categoryImage: sc.category.image,
                        }));
                        setServiceCategories(data);
                      }}
                    />
                  );
                }}
              />
              {serviceCategories.length > 0 ? (
                <FlatList
                  data={serviceCategories}
                  renderItem={({ item }) => <ListItem item={item} />}
                  keyExtractor={(item) => item.categoryName}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                />
              ) : (
                <EmptyList />
              )}
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.customQuoteButton} // Define this style below
          activeOpacity={0.8}
          onPress={() => navigation.navigate(MAIN_NAV_STRINGS.CUSTOM_QUOTE_REQUEST as never)}
        >
          <Text style={styles.customQuoteButtonText}>Request Custom Quote</Text>
          <IonIcons name="camera" size={SIZING.scaleWidth(6)} color={COLORS.WHITE} style={styles.customQuoteButtonIcon} />
        </TouchableOpacity>

        <View
          style={[
            styles.bottomLinksContainer,
            {
              marginTop: isFetching
                ? SIZING.scaleHeight(40)
                : SIZING.scaleHeight(20),
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate(MAIN_NAV_STRINGS.FAQ)}
          >
            <Text style={styles.bottomLinksText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(MAIN_NAV_STRINGS.FAQ)}
            activeOpacity={0.5}
          >
            <Text style={styles.bottomLinksText}>How to use</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: SIZING.scaleHeight(3),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(3),
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202244",
  },
  subText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(2.8),
    color: "#545454",
    opacity: 0.8,
  },
  iconPlaceholder: {
    fontSize: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    marginLeft: 34,
    marginRight: 34,
    paddingLeft: 10,
    paddingRight: 10,
    height: 64,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#B4BDC4",
  },

  promoTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#fff",
  },
  promoSubtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginTop: 4,
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 13,
    color: "#fff",

    fontWeight: "700",
  },
  categoryBox: {
    marginLeft: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(2),
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    marginTop: 31,
    marginBottom: 11,
    fontFamily: FONTS.Inter18Bold,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: SIZING.scaleWidth(2),
    paddingHorizontal: SIZING.scaleWidth(4),
    paddingVertical: SIZING.scaleHeight(1),
    marginRight: SIZING.scaleWidth(4),
  },
  activeCategoryButton: {
    backgroundColor: "#1A4371",
  },
  inactiveCategoryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#1A4371",
  },

  categoryButtonText: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.BLACK,
    marginLeft: SIZING.scaleWidth(5),
  },
  activeCategoryButtonText: {
    color: "#FFFFFF",
  },
  inactiveCategoryButtonText: {
    color: "#1A4371",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    height: SIZING.scaleHeight(15),
  },
  image: {
    width: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderRadius: 10,
  },
  location: {
    fontSize: 12,
    color: "#6C7278",
    marginBottom: 8,
    fontWeight: "regular",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#094672",
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
  },
  emptyCategoriesItem: {
    alignItems: "center",
  },
  emptyCategoriesText: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4.5),
    color: COLORS.BLACK,
  },
  carouselContainer: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    width: width * 0.8,
    marginTop: SIZING.scaleHeight(3),
    marginRight: 16,
    borderRadius: SIZING.scaleWidth(2),
    overflow: "hidden", // To ensure content stays inside the rounded corners
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  imageBackground: {
    width: "100%",
    height: SIZING.scaleHeight(20),
    justifyContent: "flex-end", // Aligns text at the bottom
  },
  textContainer: {
    marginLeft: SIZING.scaleWidth(5),
    paddingBottom: SIZING.scaleHeight(6),
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    backgroundColor: "red",
  },
  description: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: SIZING.scaleWidth(2),
    marginHorizontal: 4,
    backgroundColor: "#ccc",
  },
  listContainer: {
    marginTop: SIZING.scaleHeight(3),
  },
  imageStyle: {
    borderRadius: 12,
    width: SIZING.scaleWidth(20),
    height: SIZING.scaleHeight(10),
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject, // Fills the entire container
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Adjust the transparency as needed for the shadow
    borderRadius: 12,
  },
  content: {
    padding: 10,
  },
  iconContainer: {
    backgroundColor: "#E0E0E0",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    paddingTop: SIZING.scaleHeight(2),
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    color: COLORS.WHITE,
    fontSize: SIZING.scaleFont(3.5),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fills the entire container
    backgroundColor: "#094672",
    opacity: 0.3,
  },
  bottomLinksContainer: {
    alignItems: "center",
    marginTop: SIZING.scaleHeight(12),
    marginBottom: SIZING.scaleHeight(10),
    marginLeft: SIZING.scaleWidth(5),
  },
  bottomLinksText: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.BLUE_BORDER,
    textDecorationLine: "underline",
  },
  customQuoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZING.scaleWidth(2),
    marginHorizontal: SIZING.scaleWidth(5),
    paddingVertical: SIZING.scaleHeight(2),
    marginTop: SIZING.scaleHeight(3), // Adjust spacing as needed
  },
  customQuoteButtonText: {
    color: COLORS.WHITE,
    fontSize: SIZING.scaleFont(4),
    fontFamily: FONTS.PoppinsMedium,
    marginRight: SIZING.scaleWidth(2),
  },
  customQuoteButtonIcon: {
    marginLeft: SIZING.scaleWidth(1),
  },
});

export default HomeScreen;