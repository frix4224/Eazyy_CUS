import { atom } from "jotai";
import {
  CollectionAndDeliveryType,
  ServiceItemsType,
  ServiceCategory,
} from "../customTypes/home";
import moment from "moment";

const initialCollectionState = {
  selectedAddress: {
    id: 0,
    user_id: 0,
    lat: 0,
    long: 0,
    default: 0,
    address: "",
    type: "",
    created_at: "",
  },
  scheduleDate: moment().toDate(),
  selectedSlot: "",
  selectedSlotTime: "",
  schedule_collect_from: { id: 0, from: "" },
  dropDate: moment().toDate(),
  dropSlot: "",
  dropSlotTime: "",
  drop_collect_from: { id: 0, from: "" },
  driver_notes: "",
  facility_notes: "",
  phoneNumber: "",
};

export const tabCartAtom = atom<string>("tabCartAtom");

export const cartItemsAtoms = atom<
  { itemId: number; quantity: number; item: ServiceItemsType }[]
>([]);

export const collectionAndDeliveryAtom = atom<CollectionAndDeliveryType>(
  initialCollectionState
);
export const serviceItemsAtoms = atom<
  {
    id: number;
    name: string;
    icon: string;
    image: string;
    description: string;
    service_categories: ServiceCategory;
  }[]
>([]);

export const paymentLoadingAtom = atom<boolean>(false);
export const paymentDataAtom = atom<{
  paymentId: string;
  payment_transaction_id: number;
}>({
  paymentId: "",
  payment_transaction_id: 0,
});

export const fcmTokeAtom = atom<string>("");
