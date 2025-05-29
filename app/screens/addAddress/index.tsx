import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, showCustomToast, SIZING } from "../../utils";
import { FONTS } from "../../assets/fonts";
import IonIcons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import OctIcons from "react-native-vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  CreateUserAddressApi,
  FetchSearchAddressApi,
} from "../../services/methods/home";
import { SearchAddressCandidate } from "../../customTypes/home";
import { ActivityIndicator } from "react-native-paper";
import { CreateAddressRequest } from "../../services/types/home";
import { userAtom } from "../../store/auth";
import { useAtomValue } from "jotai";
import { useQueryClient } from "@tanstack/react-query";

const AddAddress = () => {
  const userInfo = useAtomValue(userAtom);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const [searchResults, setSearchResults] = useState<SearchAddressCandidate[]>(
    []
  );
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<{
    address: string;
    lat: number;
    long: number;
  }>();
  const [addAddressLoading, setAddAddressLoading] = useState<boolean>(false);
  const [showSearchLoading, setShowSearchLoading] = useState<boolean>(false);

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  let filterTimeout: NodeJS.Timeout;

  const onSearchAddress = (query: string) => {
    clearTimeout(filterTimeout);
    if (!query || query.length < 3) return setSearchResults([]);
    setShowSearchLoading(true);

    filterTimeout = setTimeout(async () => {
      try {
        const { data, status } = await FetchSearchAddressApi(query);
        if (status === 200 && data.status === "OK") {
          setSearchResults(data.candidates);
          setShowSearchResults(true);
        }
      } catch (error: any) {
        console.log({ error: error.message });
      } finally {
        setShowSearchLoading(false);
      }
    }, 1000);
  };
  const onPressAddAddress = async () => {
    setAddAddressLoading(true);
    const data: CreateAddressRequest = {
      user_id: Number(userInfo?.userId),
      address: selectedAddress?.address + "",
      lat: selectedAddress?.lat + "",
      long: selectedAddress?.long + "",
      type: "home",
      fullName: userInfo?.name + "",
    };
    try {
      const addAddressResponse = await CreateUserAddressApi(data);
      if (addAddressResponse.status === 200 && addAddressResponse.data.status) {
        showCustomToast("Address added successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["user_addresses"] });
        navigation.goBack();
      }
    } catch (error: any) {
      showCustomToast(JSON.stringify(error.message), "danger");
      console.log({ error: error.message });
    } finally {
      setAddAddressLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
      <View style={styles.headingContainer}>
        <View style={styles.headingBar} />
        <Text style={styles.headingText}>Address</Text>
      </View>
      <View style={styles.searchContainer}>
        <IonIcons
          name="search"
          color={COLORS.BLACK}
          size={SIZING.scaleWidth(5)}
        />
        <TextInput
          style={styles.searchInput}
          placeholderTextColor={COLORS.GRAY}
          placeholder="Search address..."
          autoCapitalize="sentences"
          autoComplete="off"
          importantForAutofill="no"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            onSearchAddress(text);
          }}
        />
        {showSearchLoading ? (
          <ActivityIndicator color={COLORS.PRIMARY} size={"small"} />
        ) : searchResults.length > 0 ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setSearchQuery("");
              setSearchResults([]);
            }}
          >
            <OctIcons
              name="x"
              size={SIZING.scaleWidth(6)}
              color={COLORS.GRAY}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {showSearchResults && (
        <View style={styles.addressListContainer}>
          <FlatList
            data={searchResults}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.addressItemContainer}
                  onPress={() => {
                    setSelectedAddress({
                      address: item.formatted_address,
                      lat: item.geometry.location.lat,
                      long: item.geometry.location.lng,
                    });
                    setSearchQuery(item.formatted_address);
                    setShowSearchResults(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="clock-time-five-outline"
                    size={SIZING.scaleWidth(6)}
                    color={COLORS.GRAY}
                  />
                  <View style={styles.addressItemTextContainer}>
                    <Text style={styles.addressItemTextHeading}>
                      {item.formatted_address}
                    </Text>
                    <Text style={styles.addressItemText}>{item.name}</Text>
                  </View>
                  <View />
                  {/* <Text style={styles.addressItemDistance}>2.7 km</Text> */}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.buttonContainer}
        onPress={onPressAddAddress}
      >
        {addAddressLoading ? (
          <ActivityIndicator color={COLORS.WHITE} size={"small"} />
        ) : (
          <Text style={styles.buttonText}>Add Address</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: SIZING.scaleHeight(5),
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(3),
  },
  headingText: {
    fontFamily: FONTS.PoppinsSemiBold,
    fontSize: SIZING.scaleFont(5),
    color: COLORS.BLACK,
  },
  headingBar: {
    height: SIZING.scaleHeight(2.2),
    backgroundColor: COLORS.PRIMARY,
    width: SIZING.scaleWidth(1),
    marginRight: SIZING.scaleWidth(2),
    borderRadius: SIZING.scaleWidth(2),
    marginTop: SIZING.scaleHeight(-0.5),
  },
  searchContainer: {
    borderColor: COLORS.GRAY,
    borderWidth: SIZING.scaleWidth(0.2),
    marginHorizontal: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(4),
    borderRadius: SIZING.scaleWidth(7),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: SIZING.scaleWidth(3),
    backgroundColor: COLORS.WHITE,
    zIndex: 2,
  },
  searchInput: {
    marginLeft: SIZING.scaleWidth(2),
    color: COLORS.BLACK,
    fontFamily: FONTS.PoppinsRegular,
    fontSize: SIZING.scaleFont(3.5),
    width: SIZING.scaleWidth(69),
  },
  addressListContainer: {
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SIZING.scaleWidth(7),
    height: SIZING.scaleHeight(25),
    marginTop: SIZING.scaleHeight(-2),
    paddingTop: SIZING.scaleHeight(4),
  },
  addressItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZING.scaleWidth(5),
    marginTop: SIZING.scaleHeight(1.5),
  },
  addressItemTextContainer: {},
  addressItemTextHeading: {
    fontFamily: FONTS.PoppinsMedium,
    color: COLORS.BLACK,
    fontSize: SIZING.scaleFont(3.8),
  },
  addressItemText: {
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.GRAY,
    fontSize: SIZING.scaleFont(3.5),
  },
  addressItemDistance: {
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.GRAY,
    fontSize: SIZING.scaleFont(3.5),
  },
  backButttonContainer: {
    backgroundColor: COLORS.GRAY,
    borderRadius: SIZING.scaleWidth(2),
    opacity: 0.5,
    width: SIZING.scaleWidth(10),
    marginLeft: SIZING.scaleWidth(5),
    paddingVertical: SIZING.scaleHeight(0.7),
    alignItems: "center",
  },
  buttonContainer: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SIZING.scaleHeight(1),
    paddingHorizontal: SIZING.scaleWidth(10),
    alignSelf: "center",
    marginBottom: SIZING.scaleHeight(2),
    position: "absolute",
    bottom: SIZING.scaleHeight(0),
    borderRadius: SIZING.scaleWidth(10),
    marginTop: SIZING.scaleHeight(2),
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: SIZING.scaleFont(3.5),
    textTransform: "uppercase",
    fontFamily: FONTS.PoppinsRegular,
  },
});
