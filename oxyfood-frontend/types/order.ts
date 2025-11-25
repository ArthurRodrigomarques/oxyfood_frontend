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
