import html2canvas from "html2canvas";

// Function to generate an image from HTML element
export async function generateImageFromElement(
  element: HTMLElement,
  format: string = "image/png"
): Promise<string | null> {
  if (!element) return null;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true, // For external images
      allowTaint: true,
      backgroundColor: null,
    });

    return canvas.toDataURL(format, 0.9); // 0.9 quality for JPEG
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

// Function to download the image
export function downloadImage(
  dataUrl: string,
  filename: string = "quote.png"
): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

// Function to copy image to clipboard
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    // Create an image blob from the data URL
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    // Use clipboard API to copy the image
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Error copying image to clipboard:", error);
    return false;
  }
}

// Function to share the image
export async function shareImage(
  dataUrl: string,
  title: string = "My Quote"
): Promise<boolean> {
  try {
    // Check if Web Share API is available
    if (navigator.share) {
      // Convert data URL to a Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      // Create a File from the Blob for sharing
      const file = new File([blob], "quote.png", { type: "image/png" });

      // Share the file
      await navigator.share({
        title,
        files: [file],
      });

      return true;
    } else {
      // Fallback for browsers that don't support the Web Share API
      return false;
    }
  } catch (error) {
    console.error("Error sharing image:", error);
    return false;
  }
}
