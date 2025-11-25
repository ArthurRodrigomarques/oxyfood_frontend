import { Order } from "@/types/order";

export const mockOrders: Order[] = [
  {
    id: "1",
    displayId: "PEDI24-0018",
    customerName: "João Silva",
    customerPhone: "(11) 98765-4321",
    customerAddress: "Rua das Flores, 123 - Apto 45",
    totalPrice: 33.9,
    paymentMethod: "Pix",
    status: "PENDING",
    createdAt: new Date(),
    items: [
      {
        id: "i1",
        quantity: 1,
        name: "X-Burger Duplo",
        extras: "+ Bacon Extra, Maionese à parte",
      },
      { id: "i2", quantity: 1, name: "Coca-Cola Lata" },
    ],
  },
  {
    id: "2",
    displayId: "PEDI24-0017",
    customerName: "Maria Santos",
    customerPhone: "(11) 91234-5678",
    customerAddress: "Av. Principal, 456",
    totalPrice: 53.9,
    paymentMethod: "Cartão",
    status: "PREPARING",
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    items: [
      {
        id: "i3",
        quantity: 1,
        name: "Pizza Margherita",
        extras: "+ Borda de Catupiry",
      },
    ],
  },
  {
    id: "3",
    displayId: "PEDI24-0016",
    customerName: "Carlos Oliveira",
    customerPhone: "(11) 99999-8888",
    customerAddress: "Rua Alameda, 789",
    totalPrice: 83.6,
    paymentMethod: "Dinheiro",
    status: "OUT",
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    items: [
      { id: "i4", quantity: 2, name: "X-Bacon Premium" },
      { id: "i5", quantity: 2, name: "Suco Natural" },
    ],
  },
];
