import RNSensitive from "react-native-sensitive-info";

const keyChainService = "we-wash";
const sharedPreferencesName = "we-wash" as const;

const config = {
  keychainService: keyChainService,
  sharedPreferencesName: sharedPreferencesName,
} as const;

export const getSecureInfo = async (key: string) => {
  return await RNSensitive.getItem(key, config);
};

export const setSecureInfo = async (key: string, value: string | any) => {
  return await RNSensitive.setItem(key, value, config);
};

export const rmeoveSecureInfo = async (key: string) => {
  return RNSensitive.deleteItem(key, config);
};
