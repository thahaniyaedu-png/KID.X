import React from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../data/products';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  inCartQty: number;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, selectedSize?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  inCartQty,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md">
      {/* Image Container (65%+ of visual weight) */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-50">
        <div
          onClick={() => onQuickView(product)}
          className="w-full h-full cursor-pointer"
        >
          <ProductVisual product={product} />
        </div>

        {/* Single clean top-left text tag if present */}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold tracking-wide text-slate-800 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-2xs pointer-events-none">
            {product.badge}
          </span>
        )}

        {/* Quick Actions Top-Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-xs ${
              isWishlisted
                ? 'bg-[#FF595E] text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-[#FF595E]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => onQuickView(product)}
            aria-label={`Quick view ${product.name}`}
            className="w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Clean unboxed metadata with typographic middot separators */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-600">{product.gender}</span>
            <span aria-hidden="true">·</span>
            <span>{product.ageGroup}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-[15px] font-semibold text-slate-900 leading-snug line-clamp-2 cursor-pointer hover:text-[#FF595E] transition-colors"
          >
            {product.name}
          </h3>
        </div>

        <div className="space-y-3 pt-1">
          {/* Rating + Price Row */}
          <div className="flex items-baseline justify-between gap-2">
            {/* Price Stack in INR ₹ */}
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-lg font-bold text-slate-900">
                ₹{product.offerPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                {product.discountPercent}% OFF
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs text-slate-600 tabular-nums shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-800">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="col-span-1 py-2 px-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap truncate"
            >
              Quick View
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(product, product.sizes[0])}
              className={`col-span-2 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                inCartQty > 0
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#FF595E] text-white hover:bg-[#e74c51]'
              }`}
            >
              {inCartQty > 0 ? (
                <>
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>In Bag ({inCartQty})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
