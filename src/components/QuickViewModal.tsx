import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw, Check } from 'lucide-react';
import { Product } from '../data/products';
import { ProductVisual } from './ProductVisual';

interface QuickViewModalProps {
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string, qty: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [qty, setQty] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'Standard');
      setQty(1);
      setAddedFeedback(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, qty);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Studio Visual Gallery */}
          <div className="relative min-h-[320px] md:min-h-[460px] flex flex-col justify-between p-6" style={{ backgroundColor: product.visual.bgTone }}>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
              <span>SKU: {product.sku}</span>
              <span>·</span>
              <span>{product.gender}</span>
              <span>·</span>
              <span>{product.ageGroup}</span>
            </div>

            <div className="my-auto py-3">
              <div className="w-full aspect-4/3 rounded-2xl overflow-hidden shadow-md border border-white/80 bg-white">
                <ProductVisual product={product} />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-900/10 pt-3">
              <span>100% Authentic KID.X Quality</span>
              <span>Child-Safe Certified</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Unboxed Metadata */}
              <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-500">
                <span className="text-[#FF595E] font-semibold">{product.category}</span>
                <span>·</span>
                <span>{product.subcategory}</span>
                <span>·</span>
                <span>Age {product.ageGroup}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm tabular-nums">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">{product.reviewsCount} Parent Reviews</span>
              </div>

              {/* INR Pricing Block */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-baseline gap-3 tabular-nums">
                  <span className="text-3xl font-bold text-slate-900">
                    ₹{product.offerPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-emerald-700">
                    {product.discountPercent}% OFF
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Inclusive of all taxes · Demo Promotional Price (Save ₹
                  {(product.originalPrice - product.offerPrice).toLocaleString('en-IN')})
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Key Highlights */}
              <ul className="space-y-1.5 text-xs text-slate-700">
                {product.highlights.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF595E] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Size / Variant Selector */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">Select Size / Pack:</span>
                  <span className="text-slate-500">Recommended for {product.ageGroup}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                        selectedSize === size
                          ? 'border-[#FF595E] bg-[#FF595E]/10 text-[#FF595E]'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity + Primary Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-11 flex items-center justify-center text-slate-700 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-11 flex items-center justify-center text-slate-700 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 h-11 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white shadow-sm transition-colors cursor-pointer whitespace-nowrap ${
                    addedFeedback ? 'bg-emerald-600' : 'bg-[#FF595E] hover:bg-[#e6484d]'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Add to Cart · ₹{(product.offerPrice * qty).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="Toggle Wishlist"
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'border-[#FF595E] bg-[#FF595E]/10 text-[#FF595E]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Trust Strip */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  <span>Delivery Across India</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1982C4] shrink-0" />
                  <span>Free Shipping &gt; ₹999</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#FF9F1C] shrink-0" />
                  <span>UPI / Card / COD Demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
