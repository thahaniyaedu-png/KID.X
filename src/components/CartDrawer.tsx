import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Truck, CheckCircle2, CreditCard, Smartphone, Banknote, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';
import { ProductVisual } from './ProductVisual';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const totalOriginal = items.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.offerPrice * item.quantity, 0);
  const totalSavings = totalOriginal - subtotal;
  const freeShippingThreshold = 999;
  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 79;
  const grandTotal = subtotal + shippingFee;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handlePlaceDemoOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setOrderId(`KIDX-IN-${randomNum}`);
    setStep('confirmed');
    onClearCart();
  };

  const resetAndClose = () => {
    setStep('cart');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/55 backdrop-blur-xs"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#FF595E]" />
            <h2 className="text-lg font-display font-bold text-slate-900">
              {step === 'cart' && `Your KID.X Bag (${items.reduce((a, b) => a + b.quantity, 0)})`}
              {step === 'checkout' && 'Demo India Checkout (₹ INR)'}
              {step === 'confirmed' && 'Demo Order Confirmed'}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close shopping bag"
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 'cart' && (
            <>
              {/* Free Shipping Progress Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  {amountForFreeShipping === 0 && subtotal > 0 ? (
                    <span>Yay! You unlocked FREE Delivery Across India!</span>
                  ) : (
                    <span>
                      Add ₹{amountForFreeShipping.toLocaleString('en-IN')} more for FREE Shipping (Orders Above ₹999)
                    </span>
                  )}
                </div>
                <div className="w-full h-2 rounded-full bg-emerald-200/70 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>

              {items.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-800">Your shopping bag is empty</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore 100 unique kids clothing, toys, baby care, books, footwear & school essentials.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-3.5 p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200/60">
                        <ProductVisual product={item.product} />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.product.id, item.size)}
                              aria-label="Remove item"
                              className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500">
                            Size: {item.size} · {item.product.ageGroup}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-baseline gap-1.5 tabular-nums">
                            <span className="text-sm font-bold text-slate-900">
                              ₹{(item.product.offerPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.product.id, item.size, -1)}
                              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.product.id, item.size, 1)}
                              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="demo-checkout-form" onSubmit={handlePlaceDemoOrder} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Demo Checkout Notice:</strong> This is a demonstration checkout flow. No real payment is charged or processed.
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Delivery Address (All-India Delivery)
                </h3>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Parent / Recipient Full Name"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF595E]"
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-Digit Mobile (+91)"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF595E]"
                  />
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="6-Digit PIN Code"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF595E]"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City & State (e.g., Bengaluru, Karnataka)"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF595E]"
                />
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat / House No., Building, Street, Landmark"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF595E]"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Select Demo Payment Option (₹ INR)
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      id: 'UPI' as const,
                      label: 'UPI (GPay / PhonePe / Paytm Demo)',
                      desc: 'Instant zero-fee demo verification',
                      icon: Smartphone,
                    },
                    {
                      id: 'CARD' as const,
                      label: 'Debit / Credit Card (RuPay / Visa / Mastercard Demo)',
                      desc: 'Demo card simulation — no card numbers stored',
                      icon: CreditCard,
                    },
                    {
                      id: 'COD' as const,
                      label: 'Cash on Delivery (Pay in ₹ INR at Doorstep)',
                      desc: 'Available across serviceable Indian PIN codes',
                      icon: Banknote,
                    },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const active = paymentMethod === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                          active
                            ? 'border-[#FF595E] bg-[#FF595E]/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? 'text-[#FF595E]' : 'text-slate-500'}`} />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                          <div className="text-[11px] text-slate-500">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          )}

          {step === 'confirmed' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-emerald-700">
                  DEMO ORDER ID: {orderId}
                </span>
                <h3 className="text-xl font-display font-bold text-slate-900">
                  Thank you, {customerName || 'Parent'}!
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Your KID.X demo order using <strong>{paymentMethod}</strong> has been simulated for{' '}
                  <strong>{city || 'India'}</strong> ({pincode || 'PIN'}). No real payment was charged.
                </p>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-3 rounded-xl bg-[#FF595E] text-white text-xs font-semibold hover:bg-[#e6484d] transition-colors cursor-pointer"
              >
                Continue Shopping on KID.X
              </button>
            </div>
          )}
        </div>

        {/* Footer Totals */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
            <div className="space-y-1.5 text-xs tabular-nums">
              <div className="flex justify-between text-slate-500">
                <span>Total MRP</span>
                <span>₹{totalOriginal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Demo Offer Discount</span>
                <span>−₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>All-India Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Payable Amount (INR)</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-6 rounded-xl bg-[#FF595E] hover:bg-[#e6484d] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>Proceed to Demo Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="demo-checkout-form"
                  className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
                >
                  Complete Demo Order · ₹{grandTotal.toLocaleString('en-IN')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
