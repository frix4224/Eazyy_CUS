export interface ServiceResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    services: {
      id: number;
      name: string;
      icon: string;
      image: string;
      description: string;
      service_categories: {
        category: {
          name: string;
          image: string;
        };
        items: {
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
        }[];
      }[];
    }[];
    items: {
      price: number;
      quantity: number;
      status: number;
      name: string;
      description: string;
      unit: string;
      created_at: string;
      updated_at: string;
    }[];
  };
}

export interface ServicesType {
  id: number;
  name: string;
  icon: string;
  image: string;
  description: string;
  service_categories: {
    category: {
      name: string;
      image: string;
    };
    items: {
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
    }[];
  }[];
}

export interface ServiceItems {
  id: number;
  service_category_id: number;
  item_id: number;
  item: {
    name: string;
    description: string;
    unit: string;
    price: number;
    quantity: number;
  };
}

export interface PlaceCODOrderRequest {
  facility_id: number;
  user_id: number;
  mobile: string;
  user_address_id: number;
  sub_total: number;
  discount: number;
  tax_percentage: number;
  total_amount: number;
  payment_method: string;
  payment_id: string;
  transaction_id: number;
  driver_notes: string;
  facility_notes: string;
  schedule: {
    pickup: {
      date: string;
      slot: string;
      time: string;
      collect_from_id: number;
    };
    drop: {
      date: string;
      slot: string;
      time: string;
      collect_from_id: number;
    };
  };
  items: {
    item_id: number;
    amount: number;
    quantity: number;
    service_id: number;
    category_id: number;
  }[];
}
export interface PlaceCODOrderResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    order_number: number;
    user_id: number;
    user_address_id: number;
    sub_total: number;
    discount: number;
    tax_percentage: number;
    payment_status: number;
    status: number;
    updated_at: string;
    created_at: string;
    id: number;
    user: {
      id: number;
      user_identifier: number;
      name: string;
      email: string;
      email_verified_at: null;
      user_type_id: number;
    };
    items: [
      {
        id: number;
        order_id: number;
        item_id: number;
        amount: number;
        quantity: number;
        service_id: number;
        category_id: number;
        created_at: string;
        updated_at: string;
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
    ];
  };
}

export interface PlaceOnlineOrderRequest {
  amount: string;
}

export interface PlaceOnlineOrderResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    payment_id: string;
    order_payment_id: number;
    checkout_url: string;
  };
}

export interface UserAddressResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    lat: number;
    long: number;
    default: number;
    address: string;
    type: string;
    created_at: string;
  }[];
}
export interface SlotsListResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
  }[];
}

export interface CollectFromListResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    id: number;
    from: string;
  }[];
}

export interface CreateAddressRequest {
  fullName: string;
  user_id: number;
  address: string;
  lat: string;
  long: string;
  type: string;
}
export interface CreateAddressResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    address: string;
    type: string;
    lat: string;
    long: string;
    user_id: string;
    created_at: string;
    id: number;
  };
}
export interface DeleteAddressResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: string;
}
export interface FetchGoogleAddressResponse {
  candidates: {
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
  }[];
  status: string;
}
export interface FetchUserOrdersResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
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
  }[];
}

export interface UserProfileResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    id: number;
    user_identifier: number;
    name: string;
    email: string;
    mobile: string;
  };
}
export interface UserProfileUpdateRequest {
  name: string;
  email: string;
  mobile: string;
}
export interface UserProfileUpdateResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: {
    id: number;
    user_identifier: number;
    name: string;
    email: string;
    mobile: string;
    email_verified_at: null;
    user_type_id: number;
  };
}
export interface UserMobileNumberUpdateResponse {
  message: string;
  otp: number;
}
export interface UserMobileNumberVerifyResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: string;
}
export interface FacilitySearchResponse {
  status_code: number;
  status: boolean;
  message: string;
  data:
    | {
        facility_name: string;
        latitude: string;
        longitude: string;
        facility_id: number;
        distance: number;
      }
    | 1;
}
