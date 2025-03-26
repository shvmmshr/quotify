declare module "dom-to-image" {
  interface DomToImageOptions {
    /**
     * A number between 0 and 1 indicating the image quality (e.g. 0.92 = 92%)
     */
    quality?: number;
    /**
     * The width in pixels to be applied to node before rendering
     */
    width?: number;
    /**
     * The height in pixels to be applied to node before rendering
     */
    height?: number;
    /**
     * A string value for the background color, any valid CSS color value
     */
    bgcolor?: string;
    /**
     * Inline styles to be applied to the root node before rendering
     */
    style?: Partial<CSSStyleDeclaration>;
    /**
     * Whether to use CORS or not on the XHR requests
     */
    useCORS?: boolean;
    /**
     * Whether to allow foreign objects in the SVG
     */
    foreignObjectRendering?: boolean;
  }

  /**
   * Renders the DOM node to a PNG image URL
   */
  export function toPng(
    node: HTMLElement,
    options?: DomToImageOptions
  ): Promise<string>;

  /**
   * Renders the DOM node to a JPEG image URL
   */
  export function toJpeg(
    node: HTMLElement,
    options?: DomToImageOptions
  ): Promise<string>;

  /**
   * Renders the DOM node to a Blob object
   */
  export function toBlob(
    node: HTMLElement,
    options?: DomToImageOptions
  ): Promise<Blob>;

  /**
   * Renders the DOM node to a Uint8Array containing raw pixel data
   */
  export function toPixelData(
    node: HTMLElement,
    options?: DomToImageOptions
  ): Promise<Uint8Array>;

  /**
   * Renders the DOM node to an SVG string
   */
  export function toSvg(
    node: HTMLElement,
    options?: DomToImageOptions
  ): Promise<string>;
}
