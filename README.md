# ÌRÍSÍ NIGERIA — Luxury Virtual Dressing & Multi-Brand Fashion Platform

> **The Premier Nigerian Fashion Hub connecting bespoke fashion houses and contemporary streetwear brands with an interactive Virtual Dressing Studio, 3D Digital Body Twin sizing, and consolidated nationwide delivery across all 36 states.**

---

## Overview

**ÌRÍSÍ** is a luxury fashion e-commerce ecosystem specifically engineered for the Nigerian fashion landscape. It bridges the gap between traditional bespoke Nigerian tailoring (*Senator Kaftans, 3-Piece Ceremonial Agbadas, Silk Bubu*) and ready-to-wear streetwear (*Heavyweight Fleece Hoodies, Baggy Denim, Handcrafted Leather Footwear, Velvet Fila Caps*).

---

## Core Features

### 1. Interactive Virtual Dressing Studio (`/studio`)
* **Live Cross-Brand Styling**: Mix and match tops, trousers, outerwear, footwear, and accessories across independent Nigerian fashion houses.
* **Photorealistic Garment Draping**: Realistic studio lighting, natural layer depth, and ambient shadows.
* **1-Click Outfit Bundle**: Instant multi-brand cart calculation in Nigerian Naira (₦) with bundle savings.

### 2. 3D Digital Body Twin & Bespoke Sizing
* **Custom Body Dimensions**: Height, weight, chest circumference, broad shoulder span, waistline, and trouser inseam.
* **Precision Tailoring Algorithm**: Computes exact size recommendations for Nigerian cuts to eliminate sizing errors.

### 3. Dedicated Merchant & Designer Hub (`/vendor-portal`)
* **Isolated Platform Architecture**: Clean standalone portal for bespoke designers and ready-to-wear boutiques.
* **2-Column Garment Studio Publisher**: Direct device/gallery photo upload with live shopper card preview.
* **Financial & Sales Analytics**: Lifetime revenue breakdown, goods sold matrix, monthly growth charts, and customer geography.
* **Paystack Escrow Banking**: Verified NUBAN payouts with automated settlements.

### 4. Shopper Profile, Orders & Verified Fit Reviews (`/profile`)
* **Mandatory Mobile Numbers**: Seamless phone & WhatsApp routing for nationwide doorstep dispatch.
* **Unified Package Tracking**: Order status timeline (*Payment Confirmed via Paystack* $\rightarrow$ *Consolidated at Ìrísí Logistics Network* $\rightarrow$ *Delivered*).
* **5-Star Fit Fidelity Reviews**: Real customers rate tailoring quality and shoulder drape.

---

## Tech Stack

* **Framework**: Next.js 16 (App Router, Turbopack)
* **Language**: TypeScript
* **Styling**: Tailwind CSS, CSS Custom Variables (Luxury Light & Dark Mode)
* **State Management**: Zustand (Persistent Local Storage with seamless migration)
* **Motion & Animations**: Framer Motion, Lenis Kinetic Smooth Scroll, Canvas Confetti
* **Icons**: Lucide React
* **Payment Integration**: Paystack Escrow Integration

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/martintimi/VeyraNig.git
cd VeyraNig
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key Routes

| Route | Description |
| :--- | :--- |
| `/` | Storefront with automated FLIP lookbook & curated Nigerian designers |
| `/studio` | Virtual Dressing Room & Cross-Brand Styling Studio |
| `/shop` | Full Product Catalog with search, category & origin filters |
| `/auth` | Luxury Split-Screen Shopper Onboarding & Body Calibration |
| `/profile` | Shopper Account, 3D Measurements & Order History |
| `/vendor-portal` | Standalone Designer & Boutique Partner Hub |
| `/admin` | Executive Command Tower & Live WhatsApp Support Line Control |

---

## License
MIT License © 2026 ÌRÍSÍ NIGERIA.
