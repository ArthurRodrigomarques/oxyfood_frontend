import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { OrderStatus } from "@/types/order";

let socket: Socket | null = null;

export function useOrderSocket(
  orderId: string,
  onStatusChange?: (newStatus: OrderStatus) => void
) {
  useEffect(() => {
    if (!orderId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

    if (!socket) {
      socket = io(socketUrl, {
        transports: ["websocket"],
      });
    }

    socket.emit("join-order-room", { orderId });
    socket.on("order-status-updated", (data: { status: OrderStatus }) => {
      const statusMap: Record<string, string> = {
        PENDING: "Pendente",
        PREPARING: "Em preparação",
        OUT: "Saiu para entrega",
        COMPLETED: "Entregue",
        REJECTED: "Rejeitado",
      };

      const label = statusMap[data.status] || data.status;
      toast.info(`Status atualizado: ${label}`);

      if (onStatusChange) {
        onStatusChange(data.status);
      }
    });

    return () => {
      if (socket) {
        socket.off("order-status-updated");
      }
    };
  }, [orderId, onStatusChange]);
}
