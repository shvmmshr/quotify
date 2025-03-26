"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteDesign } from "@/lib/types";
import { generateImageFromElement } from "@/lib/utils/image-utils";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import { downloadImage, copyImageToClipboard } from "@/lib/utils/image-utils";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface QuotePreviewProps {
  design: QuoteDesign;
}

export function QuotePreview({ design }: QuotePreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  // Apply background style based on type
  const getBackgroundStyle = () => {
    const { type, value, opacity = 1, blur = 0 } = design.background;

    if (type === "image") {
      return {
        backgroundImage: `url(${value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
      };
    }

    if (type === "gradient") {
      return {
        background: value,
        opacity,
      };
    }

    // Default to color
    return {
      backgroundColor: value,
      opacity,
    };
  };

  // Apply text style based on settings
  const getTextStyle = () => {
    const {
      font,
      fontSize,
      fontWeight,
      fontStyle,
      textDecoration,
      color,
      alignment,
      textShadow,
      lineHeight,
    } = design.quoteStyle;

    return {
      fontFamily: font,
      fontSize: `${fontSize}px`,
      fontWeight,
      fontStyle: fontStyle || "normal",
      textDecoration: textDecoration || "none",
      color,
      textAlign: alignment,
      textShadow,
      lineHeight,
    };
  };

  // Generate image using the utils
  const handleGenerateImage = async () => {
    if (!canvasRef.current) {
      toast.error("Canvas not available");
      return null;
    }

    try {
      const quality = 0.9;
      const dataUrl = await generateImageFromElement(
        canvasRef.current,
        quality
      );
      if (!dataUrl) {
        throw new Error("Failed to generate image");
      }
      return dataUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
      return null;
    }
  };

  // Handle download
  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const dataUrl = await handleGenerateImage();
      if (dataUrl) {
        const filename =
          design.quote.text.substring(0, 20).replace(/[^\w\s]/gi, "") +
          "-quote";
        downloadImage(dataUrl, `${filename}.png`);
        toast.success("Image downloaded as PNG");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    setIsCopying(true);

    try {
      const dataUrl = await handleGenerateImage();
      if (dataUrl) {
        const success = await copyImageToClipboard(dataUrl);
        if (success) {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
          toast.success("Image copied to clipboard as PNG");
        } else {
          toast.error("Failed to copy to clipboard");
        }
      }
    } catch (error) {
      console.error("Error copying image:", error);
      toast.error("Failed to copy image");
    } finally {
      setIsCopying(false);
    }
  };

  const handleZoomChange = (values: number[]) => {
    setZoom(values[0]);
  };

  const resetZoom = () => setZoom(100);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Preview</CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-24">
            <Slider
              min={25}
              max={200}
              step={25}
              value={[zoom]}
              onValueChange={handleZoomChange}
            />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={resetZoom}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset zoom</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] flex flex-col">
        <div className="overflow-auto rounded-lg border shadow-sm flex-grow relative">
          <div
            className="flex items-center justify-center min-h-full"
            style={{ padding: "1rem" }}
          >
            <div
              ref={canvasRef}
              className="relative overflow-hidden"
              style={{
                width: `${zoom}%`,
                aspectRatio: design.size.width / design.size.height,
                maxWidth: "100%",
                transition: "all 0.2s ease",
              }}
            >
              {/* Background Layer */}
              <div className="absolute inset-0" style={getBackgroundStyle()} />

              {/* Content Layer */}
              <div
                className="relative z-10 flex flex-col justify-center items-center h-full"
                style={{ padding: `${design.padding}px` }}
              >
                {/* Quote Text */}
                <div style={getTextStyle()} className="w-full">
                  <p className="mb-4 whitespace-pre-line">
                    &quot;{design.quote.text}&quot;
                  </p>

                  {/* Author (if provided) */}
                  {design.quote.author && (
                    <p
                      className="text-right"
                      style={{
                        fontSize: `${
                          Number(design.quoteStyle.fontSize) * 0.8
                        }px`,
                      }}
                    >
                      — {design.quote.author}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2">
            <Badge variant="outline" className="bg-background/80 text-xs">
              {design.size.width} × {design.size.height}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            className="flex-1 flex items-center justify-center gap-2"
            disabled={isDownloading}
            onClick={handleDownload}
          >
            {isDownloading ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            disabled={isCopying}
            onClick={handleCopy}
          >
            {isCopying ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                {copySuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}{" "}
                Copy
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
