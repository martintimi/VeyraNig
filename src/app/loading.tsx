import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8 animate-fadeIn">
      {/* Gold pulsing ring */}
      <div className="relative flex items-center justify-center h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--gold-accent)]/20 animate-ping" />
        <div className="h-10 w-10 rounded-full border-2 border-[var(--gold-accent)] border-t-transparent animate-spin" />
      </div>

      <div className="text-center space-y-1">
        <div className="font-editorial text-xl font-bold tracking-[0.25em] text-[var(--text-primary)]">
          VEYRA
        </div>
        <div className="text-[10px] font-mono-luxury uppercase tracking-[0.3em] text-[var(--gold-accent)] font-semibold">
          Curating Luxury Feed...
        </div>
      </div>
    </div>
  );
}
