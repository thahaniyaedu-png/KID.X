import React, { useState, useMemo } from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { OFFER_CAMPAIGNS, PRODUCTS, Product, MainCategory } from '../data/products';
import { ProductCard } from './ProductCard';

interface OffersViewProps {
  wishlist: string[];
  getCartQty: (productId: string) => number;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onQuickView: (product: Product) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  wishlist,
  getCartQty,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('ALL');
  const [minDiscountFilter, setMinDiscountFilter] = useState<number>(20);
  const [categoryFilter, setCategoryFilter] = useState<MainCategory | 'ALL'>('ALL');

  const handleSelectCampaign = (campaign: (typeof OFFER_CAMPAIGNS)[number]) => {
    setSelectedCampaignId(campaign.id);
    setMinDiscountFilter(campaign.minDiscount);
    setCategoryFilter(campaign.category || 'ALL');
  };

  const resetCampaigns = () => {
    setSelectedCampaignId('ALL');
    setMinDiscountFilter(20);
    setCategoryFilter('ALL');
  };

  const discountedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.discountPercent < minDiscountFilter) return false;
      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
      if (
        selectedCampaignId === 'offer-birthday' &&
        p.offerTag !== 'Birthday Special Offers' &&
        p.subcategory !== 'Birthday outfits' &&
        p.subcategory !== 'Party wear' &&
        p.subcategory !== 'Party footwear'
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => b.discountPercent - a.discountPercent);
  }, [minDiscountFilter, categoryFilter, selectedCampaignId]);

  return (
    <div className="space-y-10 py-6">
      {/* Top Offers Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#FF595E] via-[#FF7B54] to-[#FF9F1C] p-8 sm:p-10 text-white shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/90">
            <Tag className="w-4 h-4" />
            <span>KID.X SEASONAL DEMO DEALS · INDIA (₹ INR)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold leading-tight">
            Special Offers & Deals for Little Shoppers
          </h1>
          <p className="text-sm sm:text-base text-white/95 max-w-2xl leading-relaxed">
            Explore Kids Fashion Deals, Toy Time Offers, Books & Learning Deals, Baby Care Offers, and Birthday Special Offers. All prices shown are realistic ₹ INR demo prices.
          </p>
        </div>
      </div>

      {/* 7 Offer Campaign Banners Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-slate-900">
            Browse by Offer Campaign
          </h2>
          {selectedCampaignId !== 'ALL' && (
            <button
              type="button"
              onClick={resetCampaigns}
              className="text-xs font-semibold text-[#FF595E] hover:underline cursor-pointer"
            >
              Show All Offer Campaigns
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFER_CAMPAIGNS.map((camp) => {
            const isSelected = selectedCampaignId === camp.id;
            return (
              <button
                key={camp.id}
                type="button"
                onClick={() => handleSelectCampaign(camp)}
                style={{ backgroundColor: camp.bg }}
                className={`p-5 rounded-2xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900/15 -translate-y-0.5'
                    : 'border-slate-200/60 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="text-xs font-mono font-bold tracking-wider uppercase"
                    style={{ color: camp.accent }}
                  >
                    DEMO CODE: {camp.code}
                  </span>
                  <Sparkles className="w-4 h-4" style={{ color: camp.accent }} />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900">
                  {camp.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {camp.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Discount Tier Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-600 mr-1">Minimum Discount:</span>
          {[20, 25, 30, 35, 40].map((disc) => (
            <button
              key={disc}
              type="button"
              onClick={() => setMinDiscountFilter(disc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                minDiscountFilter === disc
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {disc}% OFF or more
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 tabular-nums">
          Showing <strong>{discountedProducts.length}</strong> unique discounted products (Demo ₹ INR pricing)
        </div>
      </div>

      {/* Discounted Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {discountedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlist.includes(product.id)}
            inCartQty={getCartQty(product.id)}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};
