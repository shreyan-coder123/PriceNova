# PriceNova | Next-Gen AI Market Intelligence

PriceNova is a high-performance shopping comparison engine built with Next.js 15, Genkit, and Tailwind CSS. It allows users to compare product prices across major Indian marketplaces in real-time with AI-driven intelligence.

## 🚀 Key Features

- **Multi-Platform Real-time Comparison**: Instantly matches and compares products across Amazon, Flipkart, Myntra, Ajio, Croma, Nykaa, and Reliance Digital.
- **AI-Powered Matching Engine**: Uses Google Gemini models to intelligently group identical products even when retailer titles and descriptions vary significantly.
- **Search Limit & Monetization**: 
  - 10 free high-quality searches for new users.
  - ₹500 Lifetime Pro Membership for unlimited access.
- **UPI Payment Workflow**: Professional upgrade flow with UPI payment instructions (Google Pay/PhonePe) and mandatory screenshot proof verification.
- **Mobile-First App Experience**: Optimized PWA-ready meta tags and UI interactions for a native app-like feel.
- **Intelligent Sorting**: Prioritizes results that offer comparisons from 3 or more platforms to ensure maximum value for the user.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI**: Genkit with Google Gemini 1.5 Flash
- **Styling**: Tailwind CSS & ShadCN UI
- **Icons**: Lucide React
- **Storage**: Local Storage (Search counts & Pro status)

## 📦 Deployment on Vercel

1. Create a new repository on GitHub.
2. Push this code to your repository:
   ```bash
   git init
   git remote add origin https://github.com/shreyan-coder123/PriceNova.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```
3. Go to [Vercel](https://vercel.com), import the repository, and deploy.
4. Add your `GOOGLE_GENAI_API_KEY` to the Vercel Environment Variables.

## 📄 License

Created for the PriceNova Intelligence System.
