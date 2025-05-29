export interface ServiceItemsType {
  id: number;
  service_category_id: number;
  item_id: number;
  item: {
    name: string;
    description: string;
    unit: string;
    price: number;
    quantity: number;
    status: number;
    created_at: string;
    updated_at: string;
  };
}

export interface UserAddressesType {
  id: number;
  user_id: number;
  lat: number;
  long: number;
  default: number;
  address: string;
  type: string;
  created_at: string;
}
export interface SlotsType {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}
export interface CollectFromType {
  id: number;
  from: string;
}

export interface CollectionAndDeliveryType {
  selectedAddress: UserAddressesType;
  scheduleDate: Date;
  selectedSlot: string;
  selectedSlotTime: string;
  schedule_collect_from: CollectFromType;
  dropDate: Date;
  dropSlot: string;
  dropSlotTime: string;
  drop_collect_from: CollectFromType;
  driver_notes: string;
  facility_notes: string;
  phoneNumber: string;
}
export interface Category {
  name: string;
  image: string;
}
export interface ServiceCategory {
  category: Category;
  items: ServiceItemsType[];
}

export interface SearchAddressCandidate {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  name: string;
}

export interface UserOrdersType {
  id: number;
  user_id: number;
  user_address_id: number;
  order_number: number;
  discount: number;
  sub_total: number;
  tax_percentage: number;
  tax_amount: number;
  grand_total: number;
  driver_note: null;
  facility_note: null;
  payment_status: number;
  driver_id: number;
  facility_id: number;
  status_id: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  current_status: {
    id: number;
    title: string;
    status: string;
    description: string;
  };
  items: {
    order_id: number;
    item_id: number;
    amount: number;
    quantity: number;
    service_id: number;
    category_id: number;
    item: {
      name: string;
      description: string;
      unit: string;
      price: number;
      quantity: number;
    };
  }[];
  schedule: {
    id: number;
    order_id: number;
    pickup_date: string;
    pickup_slot: string;
    pickup_time: string;
    pickup_collect_from_id: number;
    drop_date: string;
    drop_slot: string;
    drop_time: string;
    drop_collect_from_id: number;
    pickup_collect_from: {
      id: number;
      from: string;
    };
    drop_collect_from: {
      id: number;
      from: string;
    };
  };
  order_user_address: {
    id: number;
    order_id: number;
    user_id: number;
    lat: number;
    long: number;
    address: string;
    type: string;
    created_at: string;
    updated_at: string;
  };
  driver: null;
  facility: null;
}

export interface UserProfileType {
  id: number;
  user_identifier: number;
  name: string;
  email: string;
  mobile: string;
}
