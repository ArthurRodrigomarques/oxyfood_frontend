export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "OUT"
  | "COMPLETED"
  | "REJECTED";

export interface OrderItem {
  id: string;
  quantity: number;
  name: string;
  extras?: string;
}

export interface Order {
  id: string;
  displayId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalPrice: number;
  paymentMethod: "Pix" | "Dinheiro" | "Cartão";
  status: OrderStatus;
  createdAt: Date;
  items: OrderItem[];
}

export interface Option {
  id: string;
  name: string;
  priceDelta: number | string;
  groupId: string;
}

export interface OptionGroup {
  id: string;
  name: string;
  type: "SINGLE" | "MULTIPLE";
  minSelection: number;
  maxSelection: number;
  options: Option[];
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: number | string;
  imageUrl: string | null;
  categoryId: string;
  available: boolean;
  optionGroups: OptionGroup[];
}

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
  products: Product[];
}

export interface RestaurantData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  addressText: string;
  address?: string;
  phoneNumber: string;
  isOpen: boolean;
  deliveryFee: number | string;
  freeDeliveryAbove: number | string | null;
  description: string | null;
  rating?: number | null;
  categories: Category[];
}
