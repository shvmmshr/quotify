"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteDesign } from "@/lib/types";
import { generateImageFromElement } from "@/lib/utils/image-utils";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Copy,
  Image as ImageIcon,
  FileType,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  downloadImage,
  copyImageToClipboard,
  shareImage,
} from "@/lib/utils/image-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuotePreviewProps {
  design: QuoteDesign;
}

export function QuotePreview({ design }: QuotePreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);

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
      color,
      alignment,
      textShadow,
      lineHeight,
    } = design.quoteStyle;

    return {
      fontFamily: font,
      fontSize: `${fontSize}px`,
      fontWeight,
      color,
      textAlign: alignment,
      textShadow,
      lineHeight,
    };
  };

  // Generate image using the utils
  const handleGenerateImage = async (format = "image/png") => {
    if (!canvasRef.current) {
      toast.error("Canvas not available");
      return null;
    }

    try {
      const dataUrl = await generateImageFromElement(canvasRef.current, format);
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
  const handleDownload = async (format = "png") => {
    let mimeType, extension;

    switch (format) {
      case "jpg":
        mimeType = "image/jpeg";
        extension = "jpg";
        break;
      case "svg":
        mimeType = "image/svg+xml";
        extension = "svg";
        break;
      case "png":
      default:
        mimeType = "image/png";
        extension = "png";
        break;
    }

    const dataUrl = await handleGenerateImage(mimeType);
    if (!dataUrl) return;

    const filename =
      design.quote.text.substring(0, 20).replace(/[^\w\s]/gi, "") + "-quote";
    downloadImage(dataUrl, `${filename}.${extension}`);
    toast.success(`Image downloaded as ${extension.toUpperCase()}`);
  };

  // Handle copy to clipboard
  const handleCopy = async (format = "png") => {
    let mimeType;

    switch (format) {
      case "jpg":
        mimeType = "image/jpeg";
        break;
      case "svg":
        mimeType = "image/svg+xml";
        break;
      case "png":
      default:
        mimeType = "image/png";
        break;
    }

    const dataUrl = await handleGenerateImage(mimeType);
    if (!dataUrl) return;

    const success = await copyImageToClipboard(dataUrl);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast.success(`Image copied to clipboard as ${format.toUpperCase()}`);
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Handle share
  const handleShare = async () => {
    const dataUrl = await handleGenerateImage();
    if (!dataUrl) return;

    const success = await shareImage(dataUrl, "My Quote from Quotify");
    if (success) {
      toast.success("Image shared successfully");
    } else {
      toast.error("Sharing not supported in this browser");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] flex flex-col">
        <div className="overflow-hidden rounded-lg border shadow-sm flex-grow">
          <div
            ref={canvasRef}
            className="relative overflow-hidden h-full"
            style={{
              width: "100%",
              aspectRatio: design.size.width / design.size.height,
              maxWidth: "100%",
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
                  "{design.quote.text}"
                </p>

                {/* Author (if provided) */}
                {design.quote.author && (
                  <p
                    className="text-right"
                    style={{
                      fontSize: `${Number(design.quoteStyle.fontSize) * 0.8}px`,
                    }}
                  >
                    — {design.quote.author}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex-1 flex items-center justify-center gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Download Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDownload("png")}>
                <ImageIcon className="h-4 w-4 mr-2" /> PNG Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("jpg")}>
                <ImageIcon className="h-4 w-4 mr-2" /> JPG Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("svg")}>
                <FileType className="h-4 w-4 mr-2" /> SVG Vector
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Copy Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCopy("png")}>
                <ImageIcon className="h-4 w-4 mr-2" /> PNG Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopy("jpg")}>
                <ImageIcon className="h-4 w-4 mr-2" /> JPG Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
