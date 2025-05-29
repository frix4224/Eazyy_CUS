import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SIZING } from "../../utils";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "../../assets/fonts";
import IonIcons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import FaqItem from "./item";

const FAQ = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backIconContainer}
        activeOpacity={0.5}
        onPress={() => navigation.goBack()}
      >
        <IonIcons
          name="arrow-back-outline"
          size={SIZING.scaleWidth(7)}
          color={COLORS.BLACK}
          style={{
            marginTop: SIZING.scaleHeight(5),
            marginBottom: SIZING.scaleHeight(2),
          }}
        />
      </TouchableOpacity>
      <View style={styles.headingContainer}>
        <View style={styles.headingBar} />
        <Text style={styles.headingText}>Getting Started</Text>
      </View>
      <View style={styles.contactDetailsWrapper}>
        <Text style={styles.itemHeadingText}>How can we help you?</Text>
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={SIZING.scaleFont(5)}
            color={COLORS.BLACK}
          />
          <TextInput
            placeholder="Enter your keyword"
            style={styles.searchInput}
          />
        </View>
        <View style={styles.topQuestionsContainer}>
          <Text style={styles.topQuestionsText}>Top Questions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList data={[1, 2, 3, 4, 5]} renderItem={() => <FaqItem />} />
      </View>
    </ScrollView>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIconContainer: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SIZING.scaleWidth(5),
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(2),
  },
  headingText: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: SIZING.scaleFont(5),
    color: COLORS.BLACK,
  },
  itemHeadingText: {
    fontFamily: FONTS.PoppinsSemiBold,
    color: COLORS.BLACK,
    fontSize: SIZING.scaleFont(4.8),
    textAlign: "center",
    marginTop: SIZING.scaleHeight(1),
  },
  headingBar: {
    height: SIZING.scaleHeight(2.2),
    backgroundColor: COLORS.PRIMARY,
    width: SIZING.scaleWidth(1),
    marginRight: SIZING.scaleWidth(2),
    borderRadius: SIZING.scaleWidth(2),
    marginTop: SIZING.scaleHeight(-0.5),
  },
  contactDetailsWrapper: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(2),
    borderRadius: SIZING.scaleWidth(1.5),
    paddingHorizontal: SIZING.scaleWidth(3),
    paddingBottom: SIZING.scaleHeight(2),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: SIZING.scaleWidth(2),
    paddingLeft: SIZING.scaleWidth(3),
    marginVertical: SIZING.scaleHeight(1),
  },
  searchInput: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.BLACK,
    width: SIZING.scaleWidth(70),
    marginLeft: SIZING.scaleWidth(2),
    marginTop: SIZING.scaleHeight(0.5),
  },
  topQuestionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SIZING.scaleWidth(2),
    marginTop: SIZING.scaleHeight(2),
    marginBottom: SIZING.scaleHeight(1),
  },
  topQuestionsText: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: SIZING.scaleFont(4),
    color: COLORS.BLACK,
  },
  viewAllText: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.PoppinsMedium,
    fontSize: SIZING.scaleFont(3.5),
  },
});
