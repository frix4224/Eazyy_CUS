import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");
export const SIZING = {
  scaleHeight: (size: number) => (height * size) / 100,
  scaleWidth: (size: number) => (width * size) / 100,
  scaleFont: (size: number) => (width * size) / 100,
};
