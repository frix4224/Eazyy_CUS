import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  ViewToken,
  StatusBar,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from "react-native";
import { IMAGES } from "../../assets/images";
import { COLORS, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigationRef } from "../../../App";
import { MAIN_NAV_STRINGS } from "../../navigation/constants";
import { CommonActions } from "@react-navigation/native";

const slides = [
  {
    key: "1",
    title: "Welcome to Freshness!",
    subtitle: "Choose your laundry service and relax\n — we’ve got the rest!",
    image: IMAGES.SLIDER_ONE,
    headerImg: IMAGES.SHAPE_ONE,
  },
  {
    key: "2",
    title: "Track order !!",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing,\n sed do eiusmod tempor ut labore.",
    image: IMAGES.SLIDER_TWO,
    headerImg: IMAGES.SHAPE_TWO,
  },
  {
    key: "3",
    title: "Get your order !!",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing,\n sed do eiusmod tempor ut labore.",
    image: IMAGES.SLIDER_THREE,
    headerImg: IMAGES.SHAPE_THREE,
  },
];

const IntroScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<{
        key: string;
        title: string;
        subtitle: string;
        image: any;
        headerImg: any;
      }>[];
    }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(Number(viewableItems[0].index));
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderItem = ({
    item,
  }: {
    item: {
      key: string;
      title: string;
      subtitle: string;
      image: any;
      headerImg: any;
    };
  }) => {
    return (
      <ImageBackground
        key={item.key}
        source={item.image}
        style={{
          width: SIZING.scaleWidth(100),
          height: SIZING.scaleHeight(100),
        }}
      >
        <Image source={item.headerImg} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </ImageBackground>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated
        backgroundColor={"transparent"}
        barStyle={"light-content"}
        translucent
      />
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <View style={styles.dotWrapper}>
        {/* Dot indicators */}
        <View />
        <View style={styles.dotContainer}>
          {slides.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <View
                key={index.toString()}
                style={[
                  styles.dot,
                  isActive ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            );
          })}
        </View>

        {activeIndex === 2 ? (
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.doneButtonStyles}
            onPress={() => {
              if (Platform.OS === "ios") {
                navigationRef.navigate(MAIN_NAV_STRINGS.AUTHSTACK as never);
              } else {
                navigationRef.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: MAIN_NAV_STRINGS.AUTHSTACK }],
                  })
                );
              }
            }}
          >
            <Ionicons
              color={COLORS.WHITE}
              size={SIZING.scaleWidth(8)}
              name="chevron-forward"
            />
          </TouchableOpacity>
        ) : (
          <View style={{ marginBottom: SIZING.scaleHeight(5.6) }} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  image: {
    width: SIZING.scaleWidth(75),
    height: SIZING.scaleHeight(50),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: SIZING.scaleHeight(30),
  },
  titleContainer: {},
  title: {
    fontFamily: FONTS.Inter18Bold,
    fontSize: SIZING.scaleFont(5.3),
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: SIZING.scaleFont(3.5),
    color: "#666",
    textAlign: "center",
    paddingHorizontal: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(1.5),
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: SIZING.scaleWidth(2),
    height: SIZING.scaleHeight(1),
    borderRadius: SIZING.scaleWidth(10),
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#0d3b66",
  },
  inactiveDot: {
    backgroundColor: "#aaa",
  },
  dotWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  doneButtonStyles: {
    backgroundColor: "#CFD8DC",
    borderRadius: SIZING.scaleWidth(10),
    paddingHorizontal: SIZING.scaleWidth(2),
    paddingVertical: SIZING.scaleHeight(1),
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZING.scaleWidth(5),
    marginLeft: SIZING.scaleWidth(-16),
    bottom: SIZING.scaleHeight(1),
  },
});

export default IntroScreen;
