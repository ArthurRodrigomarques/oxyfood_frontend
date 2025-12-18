"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Printer, Smartphone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

interface QrCodeCardProps {
  slug: string;
  restaurantName: string;
}

export function QrCodeCard({ slug, restaurantName }: QrCodeCardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const menuUrl = `${baseUrl}/restaurants/${slug}/menu`;

  const handleDownload = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        const cleanName = restaurantName
          .replace(/[^a-z0-9]/gi, "-")
          .toLowerCase();
        downloadLink.download = `qrcode-cardapio-${cleanName || slug}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success("QR Code baixado!");
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "", "height=600,width=800");
    if (!printWindow) return;

    printWindow.document.write(
      "<html><head><title>Imprimir Cardápio Digital</title>"
    );
    printWindow.document.write("<style>");
    printWindow.document.write(`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
      body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f0f0; }
      .print-container { text-align: center; border: 2px solid #000; padding: 40px; border-radius: 20px; background: white; width: 300px; }
      .header { font-size: 24px; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; color: #000; letter-spacing: -1px; }
      .sub-header { font-size: 14px; color: #666; margin-bottom: 30px; }
      .qr-box { margin: 20px auto; border: 4px solid #000; padding: 10px; border-radius: 10px; display: inline-block; }
      .footer { margin-top: 20px; font-size: 14px; font-weight: 600; color: #000; }
      .brand { margin-top: 40px; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 2px; }
    `);
    printWindow.document.write("</style></head><body>");
    printWindow.document.write(content.innerHTML);
    printWindow.document.write("</body></html>");

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <Card className="bg-gray-50/50">
      <CardHeader>
        <CardTitle>Display de Mesa</CardTitle>
        <CardDescription>
          Visualize e imprima o display para colocar nas mesas do seu
          estabelecimento.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="hidden">
          <div ref={printRef}>
            <div className="print-container">
              <div className="header">Cardápio Digital</div>
              <div className="sub-header">
                Escaneie para ver nossas delícias
              </div>
              <div className="qr-box">
                {/* QR Code Limpo para Impressão */}
                <QRCodeSVG
                  value={menuUrl}
                  size={200}
                  level={"H"}
                  includeMargin={false}
                />
              </div>
              <div className="footer">
                <div>Aponte a câmera do seu celular</div>
                <div style={{ marginTop: "5px" }}>para acessar o cardápio</div>
              </div>
              <div className="brand">{restaurantName}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-xl w-full max-w-sm mx-auto lg:mx-0 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-500" />

          <div className="text-center space-y-1 mb-6">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
              Cardápio Digital
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              Acesse sem baixar nada
            </p>
          </div>

          <div className="flex justify-center my-6 relative">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl scale-150" />
            <div className="relative bg-white p-4 rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* QR Code Limpo para Visualização/Download */}
              <QRCodeSVG
                ref={svgRef}
                value={menuUrl}
                size={180}
                level={"H"}
                includeMargin={true}
                // imageSettings removido daqui
              />
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-700 font-bold text-sm">
              <Smartphone className="w-5 h-5 text-orange-500" />
              <span>Aponte a câmera do celular</span>
            </div>

            <div className="pt-4 border-t border-dashed border-gray-200">
              <p className="font-bold text-gray-900">{restaurantName}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-auto flex-1">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100">
            <p className="font-semibold mb-1">Dica de uso:</p>
            Imprima este modelo em papel cartão ou adesivo e coloque em suportes
            de acrílico nas mesas.
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Ações Rápidas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handlePrint}
                className="w-full gap-2 h-12"
                variant="default"
              >
                <Printer className="h-4 w-4" />
                Imprimir Display
              </Button>

              <Button
                onClick={handleDownload}
                className="w-full gap-2 h-12"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Baixar QR (PNG)
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full gap-2 justify-start h-auto py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50"
            asChild
          >
            <Link href={menuUrl} target="_blank">
              <div className="bg-orange-100 p-2 rounded-full">
                <ExternalLink className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-gray-900">
                  Testar Link
                </span>
                <span className="block text-xs text-gray-500 truncate max-w-[200px]">
                  {menuUrl}
                </span>
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
