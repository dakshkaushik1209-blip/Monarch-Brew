"use client";

import React, { useState } from "react";
import { Receipt, X, Plus, Minus, Trash2, Check, Copy, Maximize2, Minimize2 } from "lucide-react";
import { useOrderTray } from "./OrderTrayContext";
import { cafeConfig } from "@/config/cafe";

export function OrderTray() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearTray,
    totalCount,
    totalPrice,
    isOpen,
    setIsOpen,
    openTray,
    closeTray,
  } = useOrderTray();
  const [isBaristaMode, setIsBaristaMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (totalCount === 0) return null;

  const handleCopyOrder = async () => {
    const lines = [
      `${cafeConfig.name} - Counter Order:`,
      ...items.map((i) => `- ${i.quantity}x ${i.item.name} (₹${i.item.price * i.quantity})`),
      `Total: ₹${totalPrice}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <>
      {/* Floating Tray Button in Bottom Right */}
      <div className="fixed bottom-5 right-5 z-40 print:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Open counter order tray with ${totalCount} items, total ₹${totalPrice}`}
          className="flex items-center gap-3 rounded-[2px] border border-cafe-border bg-cafe-espresso px-4 py-3 text-cafe-cream shadow-2xl transition-all duration-short hover:bg-cafe-espresso/95 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-cafe-terracotta"
        >
          <div className="relative flex items-center justify-center">
            <Receipt className="h-5 w-5 text-cafe-terracotta" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-[2px] bg-cafe-terracotta text-[10px] font-bold text-cafe-cream">
              {totalCount}
            </span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cafe-cream/70">
              Counter Order Tray
            </span>
            <span className="font-heading text-sm font-bold text-cafe-cream tabular-nums">
              ₹{totalPrice}
            </span>
          </div>
        </button>
      </div>

      {/* Modal / Slide-over Tray */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Counter order slip"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-none"
        >
          {/* Backdrop Click */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setIsOpen(false);
              setIsBaristaMode(false);
            }}
          />

          {/* Paper Receipt Modal Box */}
          <div
            className={`relative z-10 w-full max-h-[90vh] overflow-y-auto rounded-[2px] border border-cafe-border bg-[#FAF5ED] p-6 shadow-2xl sm:max-w-md ${
              isBaristaMode ? "bg-[#FFFDF9]" : ""
            }`}
          >
            {/* Top Close Bar */}
            <div className="flex items-center justify-between border-b border-dashed border-cafe-border pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-cafe-terracotta" />
                <span className="text-xs font-bold uppercase tracking-wider text-cafe-espresso">
                  {isBaristaMode ? "Barista View (Counter Display)" : "Counter Order Ticket"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBaristaMode(!isBaristaMode)}
                  aria-label={isBaristaMode ? "Exit barista view" : "Enter large barista view"}
                  className="rounded-[2px] border border-cafe-border bg-cafe-cream p-1.5 text-cafe-espresso transition-colors hover:text-cafe-terracotta"
                  title="Toggle large counter view"
                >
                  {isBaristaMode ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsBaristaMode(false);
                  }}
                  aria-label="Close order ticket"
                  className="rounded-[2px] border border-cafe-border bg-cafe-cream p-1.5 text-cafe-espresso transition-colors hover:text-cafe-terracotta"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Receipt Header */}
            <div className="mt-4 text-center">
              <h3 className="font-heading text-xl font-black text-cafe-espresso">
                {cafeConfig.name}
              </h3>
              <p className="text-[11px] uppercase tracking-wider text-cafe-olive">
                {cafeConfig.address.street}
              </p>
              <div className="my-3 border-t border-dotted border-cafe-border" />
            </div>

            {/* Itemized List */}
            <div className="flex flex-col divide-y divide-dotted divide-cafe-border/80">
              {items.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between py-3 ${
                    isBaristaMode ? "py-4 text-lg" : "text-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Stepper buttons (hidden in barista mode for clean reading) */}
                    {!isBaristaMode && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name}`}
                          className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-cafe-border bg-cafe-cream text-xs font-bold text-cafe-espresso hover:bg-cafe-cream-deep"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name}`}
                          className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-cafe-border bg-cafe-cream text-xs font-bold text-cafe-espresso hover:bg-cafe-cream-deep"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    {isBaristaMode && (
                      <span className="font-heading font-black text-cafe-terracotta text-xl tabular-nums">
                        {quantity}x
                      </span>
                    )}

                    <div className="flex flex-col">
                      <span
                        className={`font-heading font-bold text-cafe-espresso ${
                          isBaristaMode ? "text-lg" : "text-sm"
                        }`}
                      >
                        {item.name}
                      </span>
                      {!isBaristaMode && (
                        <span className="text-[11px] text-cafe-espresso/70">
                          ₹{item.price} each
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-heading font-bold text-cafe-espresso tabular-nums ${
                        isBaristaMode ? "text-lg" : "text-sm"
                      }`}
                    >
                      ₹{item.price * quantity}
                    </span>

                    {!isBaristaMode && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from tray`}
                        className="text-cafe-espresso/40 hover:text-cafe-terracotta transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Calculations */}
            <div className="mt-4 border-t-2 border-dashed border-cafe-border pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cafe-espresso">
                  Total Order Amount:
                </span>
                <span className="font-heading text-2xl font-black text-cafe-espresso tabular-nums">
                  ₹{totalPrice}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-cafe-espresso/60 italic">
                All prices include applicable taxes. Hand this slip or read items at the front counter.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[2px] border border-cafe-border bg-cafe-cream px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cafe-espresso transition-colors hover:bg-cafe-cream-deep hover:text-cafe-terracotta"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-cafe-veg" />
                      <span>Order Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Order Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsBaristaMode(!isBaristaMode)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[2px] bg-cafe-terracotta px-3 py-2 text-xs font-bold uppercase tracking-wider text-cafe-cream shadow-xs transition-colors hover:bg-cafe-terracotta/90"
                >
                  <span>{isBaristaMode ? "Standard View" : "Show Barista View"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={clearTray}
                className="text-center text-[11px] text-cafe-espresso/60 underline hover:text-cafe-terracotta pt-1"
              >
                Clear all items from tray
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
