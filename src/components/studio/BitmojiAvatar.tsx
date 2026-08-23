'use client';

import React from 'react';
import { BodyProfile, ActiveOutfit } from '@/types';
import { Sparkles, Scissors, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface BitmojiAvatarProps {
  profile: BodyProfile;
  outfit: ActiveOutfit;
  viewAngle?: 'front' | 'angle' | 'detail';
}

export default function BitmojiAvatar({
  profile,
  outfit,
  viewAngle = 'front'
}: BitmojiAvatarProps) {
  const skin = profile.skinToneHex || '#3d2314';
  const hair = profile.hairColor || '#0a0a0a';
  const isFemale = profile.gender === 'female';

  // Hair style renderer
  const renderHair = () => {
    switch (profile.hairStyle) {
      case 'waves_fade':
        return (
          <g id="hair-waves">
            {/* Base wave skull cap */}
            <path d="M72 40 C72 20 128 20 128 40 C130 46 128 56 125 60 C120 54 80 54 75 60 C72 56 70 46 72 40 Z" fill={hair} />
            {/* Wave texture ripples */}
            <path d="M78 32 Q100 26 122 32" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" fill="none" />
            <path d="M76 38 Q100 32 124 38" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" fill="none" />
            <path d="M75 44 Q100 38 125 44" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" fill="none" />
            {/* Razor sharp hairline */}
            <path d="M78 48 L122 48 L124 54 L120 58 L80 58 L76 54 Z" fill={hair} />
          </g>
        );

      case 'afro_taper':
        return (
          <g id="hair-afro">
            <path
              d="M62 45 C58 20 75 8 100 8 C125 8 142 20 138 45 C142 55 138 68 132 72 C128 55 72 55 68 72 C62 68 58 55 62 45 Z"
              fill={hair}
            />
            {/* Afro curls texture dots */}
            <circle cx="85" cy="22" r="3" fill="#ffffff" opacity="0.15" />
            <circle cx="115" cy="22" r="3" fill="#ffffff" opacity="0.15" />
            <circle cx="100" cy="16" r="4" fill="#ffffff" opacity="0.15" />
            <circle cx="72" cy="36" r="3" fill="#ffffff" opacity="0.15" />
            <circle cx="128" cy="36" r="3" fill="#ffffff" opacity="0.15" />
          </g>
        );

      case 'locs':
        return (
          <g id="hair-locs">
            {/* Dreadlocks crown */}
            <path d="M68 40 C68 18 132 18 132 40 Z" fill={hair} />
            {/* Left loc strands */}
            <path d="M70 42 C64 60 62 90 64 110 C68 110 70 95 74 60 Z" fill={hair} />
            <path d="M64 45 C58 70 56 100 58 125 C62 125 64 105 68 70 Z" fill={hair} />
            {/* Right loc strands */}
            <path d="M130 42 C136 60 138 90 136 110 C132 110 130 95 126 60 Z" fill={hair} />
            <path d="M136 45 C142 70 144 100 142 125 C138 125 136 105 132 70 Z" fill={hair} />
            {/* Back loc volume */}
            <path d="M78 30 C78 70 76 130 80 140 C84 140 86 85 88 45 Z" fill={hair} opacity="0.9" />
            <path d="M122 30 C122 70 124 130 120 140 C116 140 114 85 112 45 Z" fill={hair} opacity="0.9" />
          </g>
        );

      case 'cornrows':
        return (
          <g id="hair-cornrows">
            <path d="M70 40 C70 18 130 18 130 40 Z" fill={hair} />
            {/* Braided straight rows */}
            <path d="M82 22 L82 56" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2" opacity="0.4" />
            <path d="M91 16 L91 56" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2" opacity="0.4" />
            <path d="M100 14 L100 56" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2" opacity="0.4" />
            <path d="M109 16 L109 56" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2" opacity="0.4" />
            <path d="M118 22 L118 56" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2" opacity="0.4" />
          </g>
        );

      case 'braids':
        return (
          <g id="hair-braids">
            <path d="M68 40 C68 18 132 18 132 40 Z" fill={hair} />
            {/* Long braided cascading strands */}
            <path d="M66 45 C58 80 54 140 56 180 C60 180 62 145 68 80 Z" fill={hair} />
            <path d="M74 48 C68 90 66 150 68 190 C72 190 74 155 78 90 Z" fill={hair} />
            <path d="M134 45 C142 80 146 140 144 180 C140 180 138 145 132 80 Z" fill={hair} />
            <path d="M126 48 C132 90 134 150 132 190 C128 190 126 155 122 90 Z" fill={hair} />
          </g>
        );

      case 'afro_puff':
        return (
          <g id="hair-puff">
            {/* High Afro Puff Ball */}
            <circle cx="100" cy="20" r="28" fill={hair} />
            {/* Sleek edges & gold band */}
            <path d="M72 45 C72 32 128 32 128 45 L124 58 L76 58 Z" fill={hair} />
            <rect x="88" y="32" width="24" height="4" rx="2" fill="#d4af37" />
          </g>
        );

      default: // buzzcut
        return (
          <g id="hair-buzz">
            <path d="M73 42 C73 22 127 22 127 42 C128 48 126 56 123 58 C118 52 82 52 77 58 C74 56 72 48 73 42 Z" fill={hair} />
            <path d="M76 48 L124 48 L122 54 L78 54 Z" fill={hair} />
          </g>
        );
    }
  };

  // Facial hair renderer
  const renderBeard = () => {
    if (isFemale || profile.facialHair === 'clean') return null;

    switch (profile.facialHair) {
      case 'goatee':
        return (
          <g id="beard-goatee">
            <path d="M92 76 Q100 78 108 76" stroke={hair} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M94 82 C94 92 106 92 106 82 C104 88 96 88 94 82 Z" fill={hair} />
          </g>
        );

      case 'full_beard':
        return (
          <g id="beard-full">
            <path
              d="M74 65 C74 94 84 100 100 100 C116 100 126 94 126 65 C124 82 118 92 100 92 C82 92 76 82 74 65 Z"
              fill={hair}
            />
            <path d="M90 75 Q100 77 110 75" stroke={hair} strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'mustache':
        return (
          <path d="M88 74 Q100 77 112 74" stroke={hair} strokeWidth="3.5" strokeLinecap="round" />
        );

      default: // stubble
        return (
          <path
            d="M78 68 C78 88 88 94 100 94 C112 94 122 88 122 68 C120 84 114 90 100 90 C86 90 80 84 78 68 Z"
            fill={hair}
            opacity="0.5"
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      
      {/* 3D BITMOJI SVG CANVAS */}
      <svg
        viewBox="0 0 200 480"
        className="w-full h-full max-w-[320px] max-h-[540px] drop-shadow-2xl transition-transform duration-300"
        style={{
          transform: viewAngle === 'angle' ? 'rotateY(14deg)' : 'rotateY(0deg)',
          transformOrigin: 'center center'
        }}
      >
        <defs>
          {/* Shading Gradients */}
          <radialGradient id="skinGlow" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </radialGradient>

          <linearGradient id="goldEmbroidery" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* ======================================================== */}
        {/* 1. BODY TWIN AVATAR ANATOMY & HEAD */}
        {/* ======================================================== */}

        {/* Neck */}
        <path d="M90 68 L110 68 L112 95 L88 95 Z" fill={skin} />
        <path d="M90 68 L110 68 L112 95 L88 95 Z" fill="url(#skinGlow)" />

        {/* Torso Base Body */}
        {isFemale ? (
          <path
            d="M66 94 C76 90 124 90 134 94 C142 120 130 165 120 190 C110 193 90 193 80 190 C70 165 58 120 66 94 Z"
            fill={skin}
          />
        ) : (
          <path
            d="M58 96 C74 90 126 90 142 96 C150 120 138 175 130 198 C116 200 84 200 70 198 C62 175 50 120 58 96 Z"
            fill={skin}
          />
        )}

        {/* Arms */}
        {/* Left Arm */}
        <path d="M58 98 C46 128 40 185 38 235 C43 237 48 234 52 230 C56 188 64 138 72 108 Z" fill={skin} />
        {/* Right Arm */}
        <path d="M142 98 C154 128 160 185 162 235 C157 237 152 234 148 230 C144 188 136 138 128 108 Z" fill={skin} />

        {/* Legs Base */}
        <path d="M68 272 C78 274 96 274 97 285 C95 340 90 410 88 450 C80 452 72 452 68 450 C70 410 65 340 68 272 Z" fill={skin} />
        <path d="M132 272 C122 274 104 274 103 285 C105 340 110 410 112 450 C120 452 128 452 132 450 C130 410 135 340 132 272 Z" fill={skin} />

        {/* Head Silhouette */}
        <circle cx="100" cy="50" r="26" fill={skin} />
        <circle cx="100" cy="50" r="26" fill="url(#skinGlow)" />

        {/* Expressive Cartoon Face Features */}
        {/* Eyes */}
        <ellipse cx="91" cy="48" rx="4" ry="4.5" fill="#ffffff" />
        <ellipse cx="109" cy="48" rx="4" ry="4.5" fill="#ffffff" />
        <circle cx="92" cy="48" r="2.5" fill="#1e1b18" />
        <circle cx="110" cy="48" r="2.5" fill="#1e1b18" />
        <circle cx="93" cy="46.5" r="0.8" fill="#ffffff" />
        <circle cx="111" cy="46.5" r="0.8" fill="#ffffff" />

        {/* Eyebrows */}
        <path d="M86 41 Q91 38 96 41" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M104 41 Q109 38 114 41" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Nose & Smile */}
        <path d="M100 48 L98 57 L102 57" stroke="#000000" strokeWidth="1" strokeLinecap="round" opacity="0.3" fill="none" />
        <path d="M94 62 Q100 66 106 62" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* Ears */}
        <ellipse cx="73" cy="50" rx="3.5" ry="6" fill={skin} />
        <ellipse cx="127" cy="50" rx="3.5" ry="6" fill={skin} />

        {/* Hair Layer */}
        {renderHair()}

        {/* Facial Hair */}
        {renderBeard()}

        {/* ======================================================== */}
        {/* 2. DYNAMIC BITMOJI CLOTHING TRANSFORMATION ENGINE */}
        {/* ======================================================== */}

        {/* --- LAYER 1: BOTTOMS (TROUSERS / JEANS / PANTS) --- */}
        {outfit.bottoms ? (
          <g id="bitmoji-bottoms" className="transition-all duration-500">
            {/* Trousers Silhouette */}
            <path
              d="M66 195 C78 198 122 198 134 195 C144 225 140 265 138 310 L136 442 C128 444 116 444 110 442 L103 280 L97 280 L90 442 C84 444 72 444 64 442 L62 310 C60 265 56 225 66 195 Z"
              fill={outfit.bottoms.colors?.[0]?.hex || '#1e293b'}
            />

            {/* Creases & Denim/Tailoring Stitching */}
            <path d="M100 200 L100 270" stroke="#000000" strokeWidth="1.5" opacity="0.4" />
            <path d="M78 300 Q84 340 82 430" stroke="#ffffff" strokeWidth="0.8" opacity="0.2" fill="none" />
            <path d="M122 300 Q116 340 118 430" stroke="#ffffff" strokeWidth="0.8" opacity="0.2" fill="none" />
            
            {/* Belt Line Accent */}
            <rect x="74" y="196" width="52" height="6" rx="2" fill="#000000" opacity="0.3" />
          </g>
        ) : (
          /* Default basic trunks */
          <path d="M68 196 C80 198 120 198 132 196 C136 215 134 235 130 245 L70 245 C66 235 64 215 68 196 Z" fill="#1e293b" opacity="0.5" />
        )}

        {/* --- LAYER 2: TOPS (SENATOR / HOODIE / CASUAL TOP) --- */}
        {outfit.tops ? (
          <g id="bitmoji-tops" className="transition-all duration-500">
            {/* Main Torso Garment Fit */}
            <path
              d="M56 94 C74 88 126 88 144 94 C152 118 142 180 136 220 C118 224 82 224 64 220 C58 180 48 118 56 94 Z"
              fill={outfit.tops.colors?.[0]?.hex || '#111111'}
            />

            {/* Sleeves (Left & Right) */}
            <path d="M58 96 C48 125 42 165 40 190 C46 192 52 190 56 185 C60 160 66 125 72 105 Z" fill={outfit.tops.colors?.[0]?.hex || '#111111'} />
            <path d="M142 96 C152 125 158 165 160 190 C154 192 148 190 144 185 C140 160 134 125 128 105 Z" fill={outfit.tops.colors?.[0]?.hex || '#111111'} />

            {/* Structured Mandarin / Senator Collar */}
            <path d="M88 88 C88 80 112 80 112 88 L114 96 L86 96 Z" fill={outfit.tops.colors?.[0]?.hex || '#111111'} />
            <path d="M88 88 C88 80 112 80 112 88" stroke="#d4af37" strokeWidth="1.2" fill="none" opacity="0.8" />

            {/* Geometric Nigerian Chest Embroidery (For Senators & Native Wears) */}
            {outfit.tops.tags.some(t => t.toLowerCase().includes('senator') || t.toLowerCase().includes('native')) && (
              <g id="senator-embroidery">
                {/* Placket */}
                <rect x="97" y="96" width="6" height="50" fill="url(#goldEmbroidery)" rx="1" />
                {/* Chest Geometric Accent */}
                <path d="M106 102 L124 102 L118 125 L106 125 Z" fill="url(#goldEmbroidery)" opacity="0.9" />
                <path d="M108 105 L120 105 L116 122 L108 122 Z" fill="#111111" opacity="0.8" />
                <circle cx="100" cy="104" r="1.5" fill="#ffffff" />
                <circle cx="100" cy="116" r="1.5" fill="#ffffff" />
                <circle cx="100" cy="128" r="1.5" fill="#ffffff" />
              </g>
            )}

            {/* Hoodie Kangaroo Pocket & Drawstrings (For Streetwear Hoodies) */}
            {outfit.tops.tags.some(t => t.toLowerCase().includes('hoodie') || t.toLowerCase().includes('streetwear')) && (
              <g id="hoodie-details">
                {/* Drawstrings */}
                <path d="M94 92 L94 116" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M106 92 L106 116" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                {/* Kangaroo Pocket */}
                <path d="M78 170 C78 155 122 155 122 170 L126 205 L74 205 Z" fill="#000000" opacity="0.3" />
              </g>
            )}
          </g>
        ) : null}

        {/* --- LAYER 3: OUTERWEAR (CEREMONIAL AGBADA ROBE WRAP) --- */}
        {outfit.outerwear && (
          <g id="bitmoji-agbada" className="transition-all duration-700 pointer-events-none">
            {/* Grand Flowing Agbada Wings */}
            <path
              d="M40 90 C70 80 130 80 160 90 C175 140 168 230 156 270 C140 280 60 280 44 270 C32 230 25 140 40 90 Z"
              fill={outfit.outerwear.colors?.[0]?.hex || '#0a0a0c'}
              opacity="0.94"
            />

            {/* Opulent Gold Chest Plate & Wing Drapes */}
            <path d="M84 94 L116 94 L122 145 L100 170 L78 145 Z" fill="url(#goldEmbroidery)" />
            <path d="M88 98 L112 98 L116 140 L100 160 L84 140 Z" fill={outfit.outerwear.colors?.[0]?.hex || '#0a0a0c'} />
            
            {/* Wing Fold Highlights */}
            <path d="M48 100 Q70 180 56 250" stroke="#d4af37" strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M152 100 Q130 180 144 250" stroke="#d4af37" strokeWidth="1.2" fill="none" opacity="0.6" />
          </g>
        )}

        {/* --- LAYER 4: FOOTWEAR (KANO LEATHER SLIDES / SHOES) --- */}
        {outfit.footwear ? (
          <g id="bitmoji-shoes" className="transition-all duration-500">
            {/* Left Shoe */}
            <ellipse cx="78" cy="452" rx="14" ry="7" fill={outfit.footwear.colors?.[0]?.hex || '#78350f'} />
            <rect x="68" y="445" width="20" height="4" rx="2" fill="#000000" opacity="0.4" />
            {/* Right Shoe */}
            <ellipse cx="122" cy="452" rx="14" ry="7" fill={outfit.footwear.colors?.[0]?.hex || '#78350f'} />
            <rect x="112" y="445" width="20" height="4" rx="2" fill="#000000" opacity="0.4" />
          </g>
        ) : null}

        {/* --- LAYER 5: ACCESSORIES (ROYAL VELVET FILA CAP) --- */}
        {outfit.accessories ? (
          <g id="bitmoji-fila" className="transition-all duration-500">
            {/* Traditional Pleated Fila Cap folded to the right */}
            <path
              d="M72 40 C72 18 128 18 128 40 L140 32 C146 36 142 48 130 46 L124 50 L76 50 Z"
              fill={outfit.accessories.colors?.[0]?.hex || '#18181b'}
            />
            {/* Velvet Pleat lines */}
            <path d="M78 30 Q100 24 122 30" stroke="#d4af37" strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M84 38 Q100 32 126 38" stroke="#d4af37" strokeWidth="1.2" fill="none" opacity="0.7" />
          </g>
        ) : null}

      </svg>

    </div>
  );
}
