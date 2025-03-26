import domtoimage from "dom-to-image";

// Function to generate an image from HTML element using dom-to-image (PNG only)
export async function generateImageFromElement(
  element: HTMLElement,
  quality: number = 0.9
): Promise<string | null> {
  if (!element) return null;

  try {
    // Create options for dom-to-image
    const options = {
      quality: quality,
      bgcolor: "#ffffff", // Add background for elements with transparency
      style: {
        // Ensure the element dimensions are preserved
        width: `${element.offsetWidth}px`,
        height: `${element.offsetHeight}px`,
      },
    };

    // Generate PNG image
    const dataUrl = await domtoimage.toPng(element, options);
    return dataUrl;
  } catch (error) {
    console.error("Error generating image:", error);

    // Try fallback method with different config
    try {
      console.log("Trying fallback image generation method");
      const dataUrl = await domtoimage
        .toPixelData(element)
        .then(function (pixels: Uint8Array) {
          // Create canvas from pixel data
          const width = element.offsetWidth;
          const height = element.offsetHeight;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Could not get canvas context");

          // Create ImageData and put pixels
          const imageData = new ImageData(
            new Uint8ClampedArray(pixels),
            width,
            height
          );
          ctx.putImageData(imageData, 0, 0);

          // Convert to data URL (PNG only)
          return canvas.toDataURL("image/png", quality);
        });

      return dataUrl;
    } catch (fallbackError) {
      console.error("Fallback image generation failed:", fallbackError);
      return null;
    }
  }
}

// Function to download the image (PNG only)
export function downloadImage(
  dataUrl: string,
  filename: string = "quote.png"
): void {
  try {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}

// Function to copy image to clipboard (PNG only)
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    // Create an image blob from the data URL
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    // Use clipboard API to copy the image
    if (navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      return true;
    } else {
      // Fallback for browsers without clipboard.write support
      const img = document.createElement("img");
      img.src = dataUrl;
      document.body.appendChild(img);

      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNode(img);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
      }

      document.body.removeChild(img);
      return true;
    }
  } catch (error) {
    console.error("Error copying image to clipboard:", error);
    return false;
  }
}
