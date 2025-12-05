"use client";

import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  aspectRatio?: "square" | "video" | "wide";
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
  label = "Imagem",
  aspectRatio = "square",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: (err) => {
      setIsUploading(false);
      toast.error(`Erro: ${err.message}`);
    },
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res[0]) {
        onChange(res[0].ufsUrl || res[0].url);
        toast.success("Imagem enviada!");
      }
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await startUpload([file]);
  };

  const ratioClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
      ? "aspect-video"
      : "aspect-[3/1]";

  return (
    <div className={cn("space-y-2 w-full", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg overflow-hidden transition-colors bg-gray-50 group hover:bg-gray-100",
          ratioClass,
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* LOADER DE UPLOAD */}
        {isUploading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="text-xs font-bold mt-2 text-orange-600">
              Enviando...
            </span>
          </div>
        )}

        {value ? (
          <>
            <Image
              src={value}
              alt="Upload"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8 shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  onChange("");
                }}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          /* STATE VAZIO */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <div className="bg-white p-3 rounded-full shadow-sm mb-2">
              {aspectRatio === "wide" ? (
                <ImageIcon className="h-6 w-6" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
            </div>
            <span className="text-xs font-medium text-center px-4">
              Clique para enviar {label.toLowerCase()}
            </span>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled || isUploading}
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
