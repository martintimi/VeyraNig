'use client';

import React, { useRef } from 'react';
import {
  Printer, X, Copy, Check, ShieldCheck, Truck,
  MapPin, Phone, User, Package, Calendar, QrCode
} from 'lucide-react';
import IrisiIcon from '@/components/common/IrisiIcon';

interface ShippingWaybillModalProps {
  order: any;
  vendorProfile: any;
  onClose: () => void;
}

export default function ShippingWaybillModal({
  order,
  vendorProfile,
  onClose
}: ShippingWaybillModalProps) {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const waybillNo =
    order.trackingDetails?.waybillNumber ||
    order.orderNumber?.replace('#', 'WB-') ||
    `WB-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(waybillNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const vendorName = vendorProfile?.brandName || order.items?.[0]?.vendorName || 'Verified Partner';
  const vendorCity = vendorProfile?.city || 'Lagos';
  const vendorState = vendorProfile?.state || 'Lagos';
  const vendorPhone = vendorProfile?.phone || '2349070332145';
  const vendorAddress = vendorProfile?.location || `${vendorCity}, ${vendorState}`;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      
      {/* Container Card */}
      <div className="w-full max-w-xl surface-card bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden my-auto flex flex-col">
        
        {/* Modal Action Header (Excluded from Print) */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 bg-[var(--bg-secondary)] print:hidden">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[var(--gold-accent)]" />
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Courier Shipping Waybill
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[var(--gold-accent)] text-black font-mono-luxury uppercase text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print Label</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── PRINTABLE WAYBILL SLIP (Optimized for label printers and standard A4/A5 paper) ── */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[75vh]">
          <div
            ref={printRef}
            id="printable-shipping-waybill"
            className="bg-white text-black p-5 sm:p-6 rounded-2xl border-2 border-black font-sans shadow-inner space-y-4 select-text"
          >
            {/* Top Barcode Header */}
            <div className="flex items-start justify-between border-b-2 border-black pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tighter font-serif uppercase">
                    Ì R Í S Í
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-black text-white px-1.5 py-0.5 font-bold rounded">
                    ESCROW PARCEL
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-700 block mt-0.5">
                  Automated Logistics Manifest & Transit Waybill
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-mono text-gray-500 uppercase block">Tracking No.</span>
                <span className="text-base font-mono font-black tracking-wider text-black block">
                  {waybillNo}
                </span>
              </div>
            </div>

            {/* Visual Barcode Graphic */}
            <div className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-300 flex flex-col items-center justify-center">
              {/* Simulated High-Density Code 128 Barcode */}
              <div className="h-10 w-full max-w-sm flex items-stretch justify-center gap-[2px] overflow-hidden">
                {[
                  3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3,
                  1, 2, 4, 1, 2, 3, 1, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1
                ].map((w, idx) => (
                  <div
                    key={idx}
                    className={`bg-black ${idx % 2 === 0 ? 'opacity-100' : 'opacity-0'}`}
                    style={{ width: `${w * 2}px` }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-gray-800 mt-1">
                *{waybillNo}*
              </span>
            </div>

            {/* Sender & Recipient Grid */}
            <div className="grid grid-cols-2 gap-3 border-y-2 border-black py-3 text-xs">
              
              {/* SENDER (FROM) */}
              <div className="border-r border-gray-300 pr-2.5 space-y-1">
                <span className="text-[9px] font-mono uppercase font-black tracking-wider text-gray-500 block">
                  1. SENDER (DISPATCH ATELIER/STORE)
                </span>
                <h4 className="font-bold text-sm text-black leading-tight uppercase">
                  {vendorName}
                </h4>
                <p className="text-[11px] text-gray-700 leading-snug line-clamp-2">
                  {vendorAddress}
                </p>
                <p className="text-[11px] font-mono font-semibold text-black pt-0.5">
                  Origin: <strong>{vendorCity}, {vendorState}</strong>
                </p>
                <p className="text-[11px] font-mono text-gray-800">
                  Tel: {vendorPhone}
                </p>
              </div>

              {/* RECIPIENT (TO) */}
              <div className="pl-2.5 space-y-1">
                <span className="text-[9px] font-mono uppercase font-black tracking-wider text-gray-500 block">
                  2. RECIPIENT (DELIVERY DESTINATION)
                </span>
                <h4 className="font-bold text-sm text-black leading-tight uppercase">
                  {order.customerName}
                </h4>
                <p className="text-[11px] text-gray-800 font-medium leading-snug">
                  {order.deliveryAddress}
                </p>
                <p className="text-[11px] font-mono font-semibold text-black pt-0.5">
                  City: <strong>{order.deliveryCity || 'Nigeria'}</strong>
                </p>
                <p className="text-[11px] font-mono font-bold text-black bg-gray-100 px-1.5 py-0.5 rounded inline-block">
                  Tel: {order.customerPhone || 'N/A'}
                </p>
              </div>

            </div>

            {/* Package Contents Table */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono uppercase font-black tracking-wider text-gray-500 block">
                3. PACKAGE CONTENTS & PIECES
              </span>

              <div className="border border-gray-300 rounded-lg overflow-hidden text-xs">
                <div className="grid grid-cols-12 bg-gray-100 p-2 font-mono font-bold text-[10px] text-gray-600 uppercase border-b border-gray-300">
                  <span className="col-span-8">Item Description</span>
                  <span className="col-span-2 text-center">Size</span>
                  <span className="col-span-2 text-right">Qty</span>
                </div>

                <div className="divide-y divide-gray-200">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-12 p-2 items-center text-[11px]">
                      <div className="col-span-8 font-semibold text-black truncate pr-1">
                        {item.productName || item.name || 'Garment / Piece'}
                      </div>
                      <div className="col-span-2 text-center font-mono font-bold text-gray-800">
                        {item.size || 'One Size'}
                      </div>
                      <div className="col-span-2 text-right font-mono font-bold text-black">
                        ×{item.quantity || 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Service & Escrow Badge Footer */}
            <div className="border-t-2 border-black pt-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono uppercase font-black tracking-wider text-gray-500 block">
                  Service Class
                </span>
                <span className="font-bold font-mono text-xs text-black block">
                  {order.packageMethods?.[order.items?.[0]?.vendorId] === 'park_pickup'
                    ? 'MOTOR PARK WAYBILL (INTERSTATE)'
                    : 'DOORSTEP COURIER EXPRESS'}
                </span>
                <span className="text-[10px] text-gray-600 block">
                  Inspected & verified prior to courier seal.
                </span>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-[9px] font-mono uppercase font-black tracking-wider text-gray-500 block">
                  Payment Status
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px]">
                  100% ESCROW SECURED
                </span>
                <span className="text-[9px] font-mono text-gray-500 block">
                  Do Not Collect Delivery Cash
                </span>
              </div>
            </div>

            {/* Driver Instructions Banner */}
            <div className="bg-gray-100 p-2.5 rounded-lg border border-gray-300 text-[10px] font-mono text-gray-700 leading-snug">
              <strong>COURIER / DISPATCH NOTE:</strong> Call recipient ({order.customerPhone}) prior to arrival. Verify parcel seal intact upon handover.
            </div>

          </div>
        </div>

        {/* Modal Footer (Copy tracking, Print, Close) */}
        <div className="p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-mono-luxury text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Waybill Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Tracking No.</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-mono-luxury font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-[var(--gold-accent)] text-black text-xs font-mono-luxury uppercase font-bold tracking-wider hover:opacity-90 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print Waybill</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
