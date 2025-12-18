export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "OUT"
  | "COMPLETED"
  | "REJECTED";

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number | string;
  optionsDescription?: string;
  product: {
    name: string;
    imageUrl?: string | null;
  };
}

export interface OpeningHour {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  restaurantId?: string;
}

export interface Order {
  id: string;
  displayId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;

  // Valores
  subTotalPrice: number | string;
  deliveryFee: number | string;
  totalPrice: number | string;
  trocoPara?: number | string | null;

  paymentMethod: "Pix" | "Dinheiro" | "Cartão" | string;
  status: OrderStatus;
  createdAt: Date | string;

  items: OrderItem[];
  orderItems?: OrderItem[];

  paymentStatus?: "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";
  paymentLink?: string | null;
  qrCodeBase64?: string | null;
  mercadoPagoId?: string | null;

  restaurant?: {
    name: string;
    slug: string;
    phoneNumber: string;
  };
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
  cpfCnpj: string | null;
  maxDeliveryDistanceKm?: number;

  isOpen: boolean;
  deliveryFee: number | string;
  freeDeliveryAbove: number | string | null;
  description: string | null;
  rating?: number | null;
  categories: Category[];
  openingHours?: OpeningHour[];
}
