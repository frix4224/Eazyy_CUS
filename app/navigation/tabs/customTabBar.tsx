import React, { useMemo } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import Svg, { Ellipse, Path } from "react-native-svg";
import { COLORS, SIZING } from "../../utils";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { IMAGES, TabCartIcon } from "../../assets/images";
import { MAIN_NAV_STRINGS, TAB_STRINGS } from "../constants";
import { FONTS } from "../../assets/fonts";
import { useAtomValue } from "jotai";
import { cartItemsAtoms, tabCartAtom } from "../../store";
import { navigationRef } from "../../../App";
import { CommonActions } from "@react-navigation/native";

// Define types
type AppProps = { props: BottomTabBarProps };

const TAB_HEIGHT = 80;

const CustomTabBar: React.FC<AppProps> = ({ props }) => {
  const tabCartIcon = useAtomValue(tabCartAtom);
  const cartItems = useAtomValue(cartItemsAtoms);

  const state = props.state.routes;

  const badgeCount = useMemo(() => {
    if (cartItems.length > 0) {
      let count = 0;
      cartItems.forEach((ci) => {
        count += ci.quantity;
      });
      return count;
    }
    return 0;
  }, [cartItems]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.subContent}>
          <View style={styles.innerContainerOne}>
            <Pressable
              onPress={() =>
                navigationRef.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: TAB_STRINGS.HOME }],
                  })
                )
              }
              style={{ alignItems: "center" }}
            >
              <Image
                source={
                  props.state.index === 0
                    ? IMAGES.TAB_HOMESCREEN_FILL_ICON
                    : IMAGES.TAB_HOMESCREEN_ICON
                }
                style={styles.imgStyles}
              />
              <Text style={styles.textStyles}>{state[0].name}</Text>
            </Pressable>
            <Pressable
              onPress={() => props.navigation.navigate(TAB_STRINGS.PRICE)}
              style={{ alignItems: "center" }}
            >
              <Image
                source={
                  props.state.index === 1
                    ? IMAGES.TAB_PRICING_FILL_ICON
                    : IMAGES.TAB_PRICING_ICON
                }
                style={styles.imgStyles}
              />
              <Text style={styles.textStyles}>{state[1].name}</Text>
            </Pressable>
          </View>
          <View style={styles.innerContainer}>
            <Pressable
              onPress={() => props.navigation.navigate(TAB_STRINGS.ORDER)}
              style={{ alignItems: "center" }}
            >
              <Image
                source={
                  props.state.index === 2
                    ? IMAGES.TAB_ORDERS_FILL_ICON
                    : IMAGES.TAB_ORDERS_ICON
                }
                style={styles.imgStyles}
              />
              <Text style={styles.textStyles}>{state[2].name}</Text>
            </Pressable>
            <Pressable
              onPress={() => props.navigation.navigate(TAB_STRINGS.ACCOUNT)}
              style={{ alignItems: "center" }}
            >
              <Image
                source={
                  props.state.index === 3
                    ? IMAGES.TAB_ACCOUNT_FILL_ICON
                    : IMAGES.TAB_USER_ICON
                }
                style={styles.imgStyles}
              />
              <Text style={styles.textStyles}>{state[3].name}</Text>
            </Pressable>
          </View>
        </View>

        <>
          {cartItems.length > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(MAIN_NAV_STRINGS.CART_SCREEN)
            }
            activeOpacity={0.5}
            style={[
              styles.badgeButtonContainer,
              {
                backgroundColor:
                  cartItems.length < 1
                    ? COLORS.PRIMARY_BLURRED
                    : COLORS.PRIMARY,
              },
            ]}
            disabled={cartItems.length < 1}
          >
            <TabCartIcon />
          </TouchableOpacity>
        </>
        <Svg
          width={SIZING.scaleWidth(100)}
          height={TAB_HEIGHT}
          viewBox="0 0 430 75"
        >
          <Path
            fill="#094672"
            fillRule="evenodd"
            d="M187.265 20.677 170.208 21l-16.03-21H0v90h430V0H287.138l-11.316 19-21.095.4C248.202 32.258 235.393 41 220.658 41c-14.242 0-26.685-8.166-33.393-20.323Z"
            clipRule="evenodd"
          />
          <Ellipse cx={153.706} cy={42} fill="#094672" rx={37.662} ry={42} />
          <Ellipse cx={287.61} cy={41} fill="#094672" rx={38.662} ry={41} />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  content: {},
  subContent: {
    flexDirection: "row",
    marginBottom: 10,
    zIndex: 1,
    position: "absolute",
    bottom: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textStyles: {
    color: COLORS.WHITE,
    textTransform: "capitalize",
  },
  imgStyles: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  buttonMainContainer: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    backgroundColor: "transparent",
    position: "absolute",
    alignItems: "center",
    bottom: SIZING.scaleHeight(7),
    alignSelf: "center",
    left: SIZING.scaleWidth(39),
    elevation: 7,
    paddingHorizontal: SIZING.scaleWidth(5),
  },
  buttonContainer: {
    height: 80,
    width: 80,
    borderRadius: 80 / 2,
    backgroundColor: COLORS.PRIMARY,
    position: "absolute",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 12,
    elevation: 7,
    paddingHorizontal: SIZING.scaleWidth(5),
  },
  badgeButtonContainer: {
    backgroundColor: COLORS.PRIMARY_BLURRED,
    position: "absolute",
    borderRadius: SIZING.scaleWidth(10),
    alignItems: "center",
    bottom: SIZING.scaleHeight(7),
    alignSelf: "center",
    left: SIZING.scaleWidth(42.4),
    elevation: 7,
    paddingTop: SIZING.scaleHeight(2.5),
    paddingHorizontal: SIZING.scaleWidth(5.7),
    paddingVertical: SIZING.scaleHeight(3),
  },
  badgeContainer: {
    backgroundColor: COLORS.PRICE,
    width: SIZING.scaleWidth(5.5),
    height: SIZING.scaleHeight(2.5),
    alignItems: "center",
    borderRadius: SIZING.scaleWidth(18),
    position: "absolute",
    bottom: SIZING.scaleHeight(12.5),
    right: SIZING.scaleWidth(38),
    zIndex: 10,
  },
  badgeText: {
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.2),
    color: COLORS.WHITE,
    marginTop: SIZING.scaleHeight(0.2),
    marginBottom: SIZING.scaleHeight(0.5),
  },
  innerContainerOne: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZING.scaleWidth(50),
    justifyContent: "space-between",
    paddingRight: SIZING.scaleWidth(10),
    paddingLeft: SIZING.scaleWidth(5),
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZING.scaleWidth(50),
    justifyContent: "space-between",
    paddingRight: SIZING.scaleWidth(4),
    paddingLeft: SIZING.scaleWidth(12),
  },
});

export default CustomTabBar;
