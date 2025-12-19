"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Star, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  customerName: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: Review[];
  metrics: {
    total: number;
    average: number;
  };
}

export function ReviewsSection({ restaurantId }: { restaurantId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", restaurantId],
    queryFn: async () => {
      const res = await api.get<ReviewsResponse>(
        `/restaurants/${restaurantId}/reviews`
      );
      return res.data;
    },
  });

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async () => {
      await api.post(`/restaurants/${restaurantId}/reviews`, {
        customerName: name,
        stars: rating,
        comment,
      });
    },
    onSuccess: () => {
      toast.success("Avaliação enviada com sucesso!");
      setIsOpen(false);
      setName("");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => {
      toast.error("Erro ao enviar avaliação.");
    },
  });

  if (isLoading)
    return <div className="p-4 text-center">Carregando avaliações...</div>;

  const { reviews, metrics } = data || {
    reviews: [],
    metrics: { total: 0, average: 0 },
  };

  return (
    <section className="space-y-6">
      {/* Cabeçalho das Avaliações */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center bg-orange-50 w-20 h-20 rounded-full border-2 border-orange-100">
            <span className="text-3xl font-bold text-orange-600">
              {metrics.average.toFixed(1)}
            </span>
            <div className="flex">
              <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Avaliações da Loja
            </h2>
            <p className="text-sm text-gray-500">
              {metrics.total} opiniões de clientes
            </p>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 font-bold">
              <Plus className="w-4 h-4 mr-2" />
              Avaliar Agora
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Avaliar Experiência</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Quantas estrelas?</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "w-8 h-8 transition-colors",
                          star <= rating
                            ? "fill-orange-500 text-orange-500"
                            : "text-gray-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Seu Nome</Label>
                <Input
                  placeholder="Ex: Maria Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Comentário (Opcional)</Label>
                <Textarea
                  placeholder="O que achou do lanche?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={isPending || !name}
                onClick={() => submitReview()}
                className="w-full bg-orange-500 hover:bg-orange-600 font-bold"
              >
                {isPending ? "Enviando..." : "Enviar Avaliação"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Comentários */}
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>Nenhuma avaliação ainda. Seja o primeiro!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-4 rounded-xl border shadow-sm space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="font-bold text-gray-800">
                  {review.customerName}
                </div>
                <div className="flex text-orange-500">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                  &rdquo;{review.comment}&rdquo;
                </p>
              )}
              <div className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString("pt-BR")}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
