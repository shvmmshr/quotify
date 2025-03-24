# Quotify - Beautiful Quote Image Generator

Quotify is a web application that transforms text into beautiful, shareable quote images. With an intuitive interface and AI-powered features, you can create stunning visuals for social media, presentations, or personal use.

## Features

- **Quote Editing**: Easily input and format your quotes and attributions
- **Style Customization**: Choose from various fonts, colors, and text styles
- **Background Options**: Apply solid colors, gradients, or images as backgrounds
- **Canvas Sizing**: Preset sizes optimized for different social media platforms
- **AI Features**:
  - Sentiment analysis to understand the mood of your quote
  - Background suggestions based on quote content and sentiment
  - AI-generated color palettes that complement your quote
  - Quote enhancement to refine wording and style
- **Export Options**: Download, copy to clipboard, or share directly

## Technology Stack

- **Frontend**: Next.js 14 with App Router and React 19
- **Styling**: Tailwind CSS with shadcn UI components
- **TypeScript**: For type safety and better developer experience
- **AI Integration**: OpenAI for natural language processing
- **Image Generation**: Client-side rendering with html2canvas

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/quotify.git
   ```

2. Navigate to the project directory:

   ```
   cd quotify
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Create a `.env.local` file in the root directory and add your OpenAI API key:

   ```
   OPENAI_API_KEY=your_api_key_here
   ```

5. Start the development server:

   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter your quote and optional author
2. Customize the appearance using the style and background tabs
3. Use AI features to enhance your design
4. Download or share your creation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [OpenAI](https://openai.com/) - AI language models
- [html2canvas](https://html2canvas.hertzen.com/) - HTML to canvas rendering
