export interface Quote {
  text: string;
  author?: string;
  createdAt: Date;
}

export interface QuoteStyle {
  font: string;
  fontSize: number;
  fontWeight: string;
  fontStyle?: string;
  textDecoration?: string;
  color: string;
  alignment: "left" | "center" | "right";
  textShadow?: string;
  lineHeight: number;
}

export interface BackgroundStyle {
  type: "color" | "gradient" | "image";
  value: string; // hex color, gradient string, or image URL
  opacity?: number;
  blur?: number;
}

export interface CanvasSize {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface QuoteDesign {
  quote: Quote;
  quoteStyle: QuoteStyle;
  background: BackgroundStyle;
  size: CanvasSize;
  padding: number;
}

export interface SentimentAnalysis {
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  emotions?: {
    joy?: number;
    sadness?: number;
    anger?: number;
    fear?: number;
    surprise?: number;
  };
}

export interface BackgroundSuggestion {
  type: "color" | "gradient" | "image";
  value: string;
  description: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}
