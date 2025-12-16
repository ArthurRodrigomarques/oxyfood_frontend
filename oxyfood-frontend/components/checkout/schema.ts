import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nome muito curto"),
  customerPhone: z.string().min(9, "Telefone inválido"),
  customerAddress: z.string().min(10, "Endereço muito curto"),
  paymentMethod: z.enum(["Dinheiro", "Pix", "Cartao", "CartaoOnline"]),
  trocoPara: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
