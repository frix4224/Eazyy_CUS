export { COLORS } from "./colors";
export { SIZING } from "./sizing";

import { Toast as CustomToast } from "react-native-toast-notifications";

let currentToast = "";

export const showCustomToast = (
  text: string,
  type: "normal" | "success" | "warning" | "danger" = "normal"
) => {
  if (currentToast) {
    CustomToast.hide(currentToast);
  }
  currentToast = CustomToast.show(text, { type });
};
