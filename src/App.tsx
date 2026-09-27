import React, { useState, useMemo } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  Download,
  Truck,
  ShieldCheck,
  Sparkles,
  Award,
  Instagram,
  Facebook,
  ArrowRight,
  RotateCcw,
  X,
  CheckCircle2,
  WifiOff,
  Menu,
} from 'lucide-react';
import {
  PRODUCTS,
  MAIN_CATEGORIES,
  AGE_GROUPS,
  OFFER_CAMPAIGNS,
  Product,
  MainCategory,
  GenderFilter,
  AgeGroup,
} from './data/products';
import { BrandLogo } from './components/BrandLogo';
import { HeroSlider } from './components/HeroSlider';
import { ProductCard } from './components/ProductCard';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { ContactSection } from './components/ContactSection';
import { OffersView } from './components/OffersView';
import { usePWAInstall, useOnlineStatus } from './hooks/usePWAInstall';

type ActivePage = 'home' | 'shop' | 'offers' | 'wishlist' | 'contact';
type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'discount';

export default function App() {
  // Navigation & Page State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Advanced Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | 'ALL'>('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<GenderFilter | 'ALL'>('ALL');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | 'ALL'>('ALL');
  const [selectedPriceBand, setSelectedPriceBand] = useState<'ALL' | 'UNDER_500' | '500_999' | '1000_1499' | '1500_PLUS'>('ALL');
  const [selectedMinDiscount, setSelectedMinDiscount] = useState<number>(0);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('ALL');
  const [selectedBadgeTab, setSelectedBadgeTab] = useState<'ALL' | 'New Arrival' | 'Best Seller' | 'Trending'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Cart, Wishlist & Quick View State
  const [wishlist, setWishlist] = useState<string[]>(['kidx-001', 'kidx-013', 'kidx-030', 'kidx-066']);
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], size: PRODUCTS[0].sizes[0], quantity: 1 },
    { product: PRODUCTS[29], size: PRODUCTS[29].sizes[0], quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Newsletter & PWA State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Helpers for Cart & Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const getCartQty = (productId: string) => {
    return cart
      .filter((item) => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const addToCart = (product: Product, size?: string, qty = 1) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === chosenSize
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [...prev, { product, size: chosenSize, quantity: qty }];
    });
  };

  const updateCartQty = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedSubcategory('ALL');
    setSelectedGender('ALL');
    setSelectedAge('ALL');
    setSelectedPriceBand('ALL');
    setSelectedMinDiscount(0);
    setSelectedSizeFilter('ALL');
    setSelectedBadgeTab('ALL');
    setSortBy('popular');
  };

  const jumpToCatalogWithFilter = (opts: {
    category?: MainCategory | 'ALL';
    subcategory?: string;
    gender?: GenderFilter | 'ALL';
    age?: AgeGroup | 'ALL';
    minDiscount?: number;
  }) => {
    clearAllFilters();
    if (opts.category) setSelectedCategory(opts.category);
    if (opts.subcategory) setSelectedSubcategory(opts.subcategory);
    if (opts.gender) setSelectedGender(opts.gender);
    if (opts.age) setSelectedAge(opts.age);
    if (opts.minDiscount !== undefined) setSelectedMinDiscount(opts.minDiscount);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Available subcategories based on selected main category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return Array.from(new Set(PRODUCTS.map((p) => p.subcategory)));
    }
    const found = MAIN_CATEGORIES.find((c) => c.name === selectedCategory);
    return found ? found.subcategories : [];
  }, [selectedCategory]);

  // Available sizes based on current category selection
  const availableSizes = useMemo(() => {
    const base =
      selectedCategory === 'ALL'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === selectedCategory);
    const set = new Set<string>();
    base.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set).slice(0, 18);
  }, [selectedCategory]);

  // Filtered & Sorted Products (Strictly Unique by ID)
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = PRODUCTS.filter((p) => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (selectedSubcategory !== 'ALL' && p.subcategory !== selectedSubcategory) return false;
      if (selectedGender !== 'ALL' && p.gender !== selectedGender) return false;
      if (selectedAge !== 'ALL' && p.ageGroup !== selectedAge) return false;
      if (selectedMinDiscount > 0 && p.discountPercent < selectedMinDiscount) return false;
      if (selectedSizeFilter !== 'ALL' && !p.sizes.includes(selectedSizeFilter)) return false;
      if (selectedBadgeTab !== 'ALL' && p.badge !== selectedBadgeTab) return false;

      if (selectedPriceBand === 'UNDER_500' && p.offerPrice >= 500) return false;
      if (selectedPriceBand === '500_999' && (p.offerPrice < 500 || p.offerPrice > 999)) return false;
      if (selectedPriceBand === '1000_1499' && (p.offerPrice < 1000 || p.offerPrice > 1499)) return false;
      if (selectedPriceBand === '1500_PLUS' && p.offerPrice < 1500) return false;

      if (q) {
        const haystack = `${p.name} ${p.category} ${p.subcategory} ${p.gender} ${p.ageGroup} ${p.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') return a.offerPrice - b.offerPrice;
      if (sortBy === 'price-desc') return b.offerPrice - a.offerPrice;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'newest') {
        const aNew = a.badge === 'New Arrival' ? 1 : 0;
        const bNew = b.badge === 'New Arrival' ? 1 : 0;
        if (bNew !== aNew) return bNew - aNew;
        return b.id.localeCompare(a.id);
      }
      // 'popular'
      return b.reviewsCount - a.reviewsCount;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedGender,
    selectedAge,
    selectedPriceBand,
    selectedMinDiscount,
    selectedSizeFilter,
    selectedBadgeTab,
    sortBy,
  ]);

  // Strict Disjoint Partition for Homepage Showcases so NO product ever appears twice on the Homepage!
  const homepagePartitions = useMemo(() => {
    const usedIds = new Set<string>();
    const takeUnique = (predicate: (p: Product) => boolean, count: number): Product[] => {
      const result: Product[] = [];
      for (const item of PRODUCTS) {
        if (!usedIds.has(item.id) && predicate(item)) {
          usedIds.add(item.id);
          result.push(item);
          if (result.length === count) break;
        }
      }
      return result;
    };

    return {
      newArrivals: takeUnique((p) => p.badge === 'New Arrival', 4),
      bestSellers: takeUnique((p) => p.badge === 'Best Seller', 4),
      trending: takeUnique((p) => p.badge === 'Trending' || p.badge === 'Festive Pick', 4),
      deals: takeUnique((p) => p.discountPercent >= 30, 4),
      clothing: takeUnique((p) => p.category === 'Kids Clothing', 8),
      toys: takeUnique((p) => p.category === 'Toys', 8),
      care: takeUnique((p) => p.category === 'Baby & Kids Care', 4),
      books: takeUnique((p) => p.category === 'Books & Learning', 4),
      accessories: takeUnique((p) => p.category === 'Baby Accessories', 4),
      footwear: takeUnique((p) => p.category === 'Kids Footwear', 4),
      school: takeUnique((p) => p.category === 'School & Activity', 4),
    };
  }, []);

  const wishlistedProducts = useMemo(
    () => PRODUCTS.filter((p) => wishlist.includes(p.id)),
    [wishlist]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-slate-900">
      {/* Offline Connectivity Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode — Browsing cached KID.X catalogue.</span>
        </div>
      )}

      {/* 1. Slim India Market Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="font-semibold text-[#FFCA3A]">KID.X INDIA</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>Delivery Across India</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline font-medium text-emerald-300">
              Free Shipping on Orders Above ₹999
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline text-slate-300">Ages 0–10 Years · ₹ INR</span>
            {!isInstalled && (isInstallable || isIOS) && (
              <button
                type="button"
                onClick={() => (isInstallable ? install() : setShowIOSModal(true))}
                className="inline-flex items-center gap-1 text-[#FFCA3A] hover:underline font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install KID.X App</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Sticky Header with SMALL KID.X Logo, Search, Nav & Actions */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Small, Clean KID.X Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle Menu"
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                clearAllFilters();
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer focus:outline-none"
            >
              <BrandLogo size="sm" />
            </button>
          </div>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activePage === 'home'
                  ? 'border-[#FF595E] text-slate-950'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                clearAllFilters();
                setActivePage('shop');
              }}
              className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activePage === 'shop' && selectedCategory === 'ALL'
                  ? 'border-[#FF595E] text-slate-950'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              All 100 Products
            </button>
            <button
              type="button"
              onClick={() => jumpToCatalogWithFilter({ category: 'Kids Clothing' })}
              className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activePage === 'shop' && selectedCategory === 'Kids Clothing'
                  ? 'border-[#FF595E] text-slate-950'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              Clothing
            </button>
            <button
              type="button"
              onClick={() => jumpToCatalogWithFilter({ category: 'Toys' })}
              className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activePage === 'shop' && selectedCategory === 'Toys'
                  ? 'border-[#FF595E] text-slate-950'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              Toys
            </button>
            <button
              type="button"
              onClick={() => jumpToCatalogWithFilter({ category: 'Books & Learning' })}
              className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activePage === 'shop' && selectedCategory === 'Books & Learning'
                  ? 'border-[#FF595E] text-slate-950'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              Books
            </button>
            <button
              type="button"
              onClick={() => {
                setActivePage('offers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activePage === 'offers'
                  ? 'border-[#FF595E] text-[#FF595E]'
                  : 'border-transparent text-[#FF595E] hover:text-[#e0484d]'
              }`}
            >
              Offers & Deals
            </button>
            <button
              type="button"
              onClick={() => {
                setActivePage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activePage === 'contact'
                  ? 'border-[#FF595E] text-slate-950'
                  : 'border-transparent hover:text-slate-950'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Search Bar, Wishlist, Cart & PWA Install */}
          <div className="flex items-center gap-2.5 flex-1 lg:flex-initial justify-end">
            {/* Search Input */}
            <div className="relative w-full max-w-[220px] sm:max-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== 'shop') setActivePage('shop');
                }}
                placeholder="Search clothes, toys, books..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-100/90 border border-transparent focus:bg-white focus:border-[#FF595E] focus:outline-none transition-colors"
              />
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => {
                setActivePage('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Wishlist"
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlist.length > 0 ? 'fill-[#FF595E] text-[#FF595E]' : ''
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FF595E] hover:bg-[#e6484d] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[11px] font-mono tabular-nums">
                {totalCartItems}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Home', action: () => setActivePage('home') },
                { label: 'All 100 Products', action: () => { clearAllFilters(); setActivePage('shop'); } },
                { label: 'Offers & Deals', action: () => setActivePage('offers') },
                { label: 'Contact Us', action: () => setActivePage('contact') },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-800"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
              {MAIN_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    jumpToCatalogWithFilter({ category: cat.name });
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-14">
        {/* =========================================================
            PAGE 1: HOMEPAGE
           ========================================================= */}
        {activePage === 'home' && (
          <>
            {/* 1. 6-Slide Full-Width Hero Slider */}
            <HeroSlider
              onSelectCTA={(target) => {
                if (target === 'OFFERS') {
                  setActivePage('offers');
                } else if (target === 'ALL') {
                  clearAllFilters();
                  setActivePage('shop');
                } else {
                  jumpToCatalogWithFilter({ category: target });
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 2. Prominent Offers & Deals Strip */}
            <section aria-label="Special Offers Strip" className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#FF595E]">
                    Exciting Demo Deals · ₹ INR
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                    Offers & Deals Corner
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('offers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FF595E] hover:underline cursor-pointer whitespace-nowrap"
                >
                  <span>View All Offers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {OFFER_CAMPAIGNS.map((offer) => (
                  <button
                    key={offer.id}
                    type="button"
                    onClick={() => {
                      setActivePage('offers');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ backgroundColor: offer.bg }}
                    className="p-4 rounded-2xl border border-slate-200/60 text-left flex flex-col justify-between hover:-translate-y-0.5 transition-transform cursor-pointer"
                  >
                    <span
                      className="text-[11px] font-mono font-bold uppercase"
                      style={{ color: offer.accent }}
                    >
                      {offer.code}
                    </span>
                    <div className="mt-2">
                      <div className="text-sm font-display font-bold text-slate-900 leading-snug">
                        {offer.title}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        {offer.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Shop by Category (7 Core Categories) */}
            <section aria-label="Shop by Category" className="space-y-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Everything Little Ones Love, All in One Place
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                    Shop by Category
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setActivePage('shop');
                  }}
                  className="text-xs sm:text-sm font-semibold text-[#1982C4] hover:underline cursor-pointer whitespace-nowrap"
                >
                  Browse Full Catalogue (100 Items) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MAIN_CATEGORIES.map((cat) => {
                  const count = PRODUCTS.filter((p) => p.category === cat.name).length;
                  return (
                    <div
                      key={cat.name}
                      style={{ backgroundColor: cat.bgTint }}
                      className="p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between gap-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs font-mono font-bold uppercase"
                            style={{ color: cat.accent }}
                          >
                            {count} Unique Products
                          </span>
                        </div>
                        <h3
                          onClick={() => jumpToCatalogWithFilter({ category: cat.name })}
                          className="text-xl font-display font-bold text-slate-900 cursor-pointer hover:underline"
                        >
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-600">{cat.tagline}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cat.subcategories.slice(0, 5).map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() =>
                              jumpToCatalogWithFilter({ category: cat.name, subcategory: sub })
                            }
                            className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-[11px] font-medium text-slate-700 border border-slate-200/60 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            {sub}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => jumpToCatalogWithFilter({ category: cat.name })}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white cursor-pointer whitespace-nowrap"
                          style={{ backgroundColor: cat.accent }}
                        >
                          Explore All →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. Shop by Age (Expanded 0–10 Years: 11 Age Brackets) */}
            <section aria-label="Shop by Age 0 to 10 Years" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#0D9488]">
                    Expanded Age Range · Newborn to 10 Years
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                    Shop by Age (0–10 Years)
                  </h2>
                </div>
                <span className="text-xs text-slate-500">
                  Select an age group to filter size-appropriate clothing, toys, books & care
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2.5">
                {AGE_GROUPS.map((age) => (
                  <button
                    key={age.label}
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ age: age.label })}
                    style={{ backgroundColor: age.color }}
                    className="p-3.5 rounded-2xl border border-slate-900/5 hover:border-slate-900/25 text-center flex flex-col items-center justify-center gap-1 transition-transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span className="text-[11px] font-semibold text-slate-600">
                      {age.stage}
                    </span>
                    <span className="text-base font-display font-bold text-slate-900 whitespace-nowrap">
                      {age.short}
                    </span>
                    <span className="text-[11px] text-slate-700 font-medium whitespace-nowrap">
                      {age.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 5. Shop by Gender (Boys, Girls, Unisex) */}
            <section aria-label="Shop by Gender" className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5CF6]">
                  Curated Wardrobes & Play Worlds
                </p>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Shop by Gender
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* BOYS */}
                <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-blue-100/70 border border-sky-200/80 p-6 sm:p-7 flex flex-col justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700">
                      BOYS COLLECTION · 0–10Y
                    </span>
                    <h3 className="text-2xl font-display font-bold text-slate-900">
                      BOYS
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Boys casual wear, shirts, polo tees, joggers, jeans, festive kurtas, tuxedo party suits, nightwear, sneakers & caps.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs text-sky-900">
                    <span>Casual Wear</span>
                    <span>·</span>
                    <span>Party Wear</span>
                    <span>·</span>
                    <span>Ethnic Wear</span>
                    <span>·</span>
                    <span>Footwear</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ gender: 'Boys' })}
                    className="w-full py-3 px-5 rounded-xl bg-[#1982C4] hover:bg-[#146ca3] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Shop Boys</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* GIRLS */}
                <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-rose-100/70 border border-pink-200/80 p-6 sm:p-7 flex flex-col justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-700">
                      GIRLS COLLECTION · 0–10Y
                    </span>
                    <h3 className="text-2xl font-display font-bold text-slate-900">
                      GIRLS
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Smocked frocks, tulle party dresses, tops, skirts, wide-leg jeans, co-ord sets, lehenga cholis, night suits, Mary Janes & hair bows.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs text-pink-900">
                    <span>Dresses & Frocks</span>
                    <span>·</span>
                    <span>Party & Ethnic</span>
                    <span>·</span>
                    <span>Footwear</span>
                    <span>·</span>
                    <span>Accessories</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ gender: 'Girls' })}
                    className="w-full py-3 px-5 rounded-xl bg-[#EC4899] hover:bg-[#db2777] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Shop Girls</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* UNISEX */}
                <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-emerald-200/80 p-6 sm:p-7 flex flex-col justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                      UNISEX ESSENTIALS · 0–10Y
                    </span>
                    <h3 className="text-2xl font-display font-bold text-slate-900">
                      UNISEX
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Organic bodysuits, rompers, Montessori wooden toys, STEM kits, gentle baby skincare, illustrated books, feeding gear & school bags.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs text-emerald-900">
                    <span>Newborn Sets</span>
                    <span>·</span>
                    <span>Toys & STEM</span>
                    <span>·</span>
                    <span>Baby Care</span>
                    <span>·</span>
                    <span>Books & School</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ gender: 'Unisex' })}
                    className="w-full py-3 px-5 rounded-xl bg-[#0D9488] hover:bg-[#0f766e] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Shop Unisex</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* 6. New Arrivals, Best Sellers & Trending (Strictly Disjoint Unique Products) */}
            <section aria-label="New Arrivals" className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#FF595E]">
                    Just Landed on KID.X
                  </p>
                  <h2 className="text-2xl font-display font-bold text-slate-900">
                    New Arrivals
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setSelectedBadgeTab('New Arrival');
                    setActivePage('shop');
                  }}
                  className="text-xs font-semibold text-[#FF595E] hover:underline cursor-pointer"
                >
                  View All New Arrivals →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {homepagePartitions.newArrivals.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlist.includes(p.id)}
                    inCartQty={getCartQty(p.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            </section>

            <section aria-label="Best Sellers" className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#FF9F1C]">
                    Most Loved by Indian Parents
                  </p>
                  <h2 className="text-2xl font-display font-bold text-slate-900">
                    Best Sellers
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setSelectedBadgeTab('Best Seller');
                    setActivePage('shop');
                  }}
                  className="text-xs font-semibold text-[#FF595E] hover:underline cursor-pointer"
                >
                  View All Best Sellers →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {homepagePartitions.bestSellers.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlist.includes(p.id)}
                    inCartQty={getCartQty(p.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            </section>

            <section aria-label="Trending Products" className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1982C4]">
                    Popular Right Now
                  </p>
                  <h2 className="text-2xl font-display font-bold text-slate-900">
                    Trending Products
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setSelectedBadgeTab('Trending');
                    setActivePage('shop');
                  }}
                  className="text-xs font-semibold text-[#1982C4] hover:underline cursor-pointer"
                >
                  View All Trending →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {homepagePartitions.trending.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlist.includes(p.id)}
                    inCartQty={getCartQty(p.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            </section>

            {/* 7. Category Showcases (Disjoint — Zero Duplicate Products Across Sections) */}
            {[
              {
                title: 'Kids Clothing (Boys, Girls & Baby)',
                subtitle: 'Bodysuits, rompers, tees, shirts, dresses, ethnic wear, party suits & nightwear',
                category: 'Kids Clothing' as MainCategory,
                items: homepagePartitions.clothing,
              },
              {
                title: 'Toys & Playroom',
                subtitle: 'Plush teddies, wooden stackers, Montessori kits, pretend play, puzzles & RC cars',
                category: 'Toys' as MainCategory,
                items: homepagePartitions.toys,
              },
              {
                title: 'Baby & Kids Care',
                subtitle: 'Gentle daily lotions, tear-free washes, massage oils, bamboo wipes & bath hampers',
                category: 'Baby & Kids Care' as MainCategory,
                items: homepagePartitions.care,
              },
              {
                title: 'Books & Early Learning',
                subtitle: 'Touch-and-feel board books, Indian ABCs, sticker books, storybooks & science guides',
                category: 'Books & Learning' as MainCategory,
                items: homepagePartitions.books,
              },
              {
                title: 'Baby Accessories',
                subtitle: 'Silicone bibs, glass feeding bottles, weighted straw sippers, mulmul dohars & caps',
                category: 'Baby Accessories' as MainCategory,
                items: homepagePartitions.accessories,
              },
              {
                title: 'Kids Footwear',
                subtitle: 'Cork sandals, mesh sneakers, uniform school shoes, party Mary Janes & cloud slides',
                category: 'Kids Footwear' as MainCategory,
                items: homepagePartitions.footwear,
              },
              {
                title: 'School & Creative Activity',
                subtitle: 'Wooden art briefcases, beeswax crayons, DIY craft kits, ergonomic bags & steel bento boxes',
                category: 'School & Activity' as MainCategory,
                items: homepagePartitions.school,
              },
            ].map((sec) => (
              <section key={sec.title} className="space-y-5 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900">
                      {sec.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{sec.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ category: sec.category })}
                    className="text-xs font-semibold text-[#FF595E] hover:underline cursor-pointer self-start sm:self-auto whitespace-nowrap"
                  >
                    Explore All {sec.category} →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sec.items.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isWishlisted={wishlist.includes(p.id)}
                      inCartQty={getCartQty(p.id)}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={addToCart}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* 8. Why Choose KID.X */}
            <section
              aria-label="Why Choose KID.X"
              className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF595E]">
                  THE KID.X PROMISE
                </p>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Why Indian Parents Choose KID.X
                </h2>
                <p className="text-sm text-slate-600">
                  Designed specifically for Indian weather, festive traditions, and growing milestones from 0 to 10 years.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Sparkles,
                    title: 'Skin-Friendly Fabrics',
                    desc: '100% combed organic cotton, breathable mulmul, and scratch-free lined festive wear tailored for Indian climates.',
                    color: '#FF595E',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Child-Safe Toys & Care',
                    desc: 'Splinter-free wooden toys finished with non-toxic water-based paints and mild plant-derived daily care.',
                    color: '#0D9488',
                  },
                  {
                    icon: Award,
                    title: '0–10 Years Milestone Fit',
                    desc: '11 dedicated age stages from Newborn (0–6M) to Tween (9–10Y) with adjustable waistbands and true sizing.',
                    color: '#FF9F1C',
                  },
                  {
                    icon: Truck,
                    title: 'Delivery Across India',
                    desc: 'Free shipping on orders above ₹999 with Demo UPI, Debit/Credit Card, and Cash on Delivery convenience.',
                    color: '#1982C4',
                  },
                ].map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className="p-5 rounded-2xl bg-[#FDFBF7] border border-slate-200/60 space-y-3"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                        style={{ backgroundColor: pillar.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-display font-bold text-slate-900">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 9. Official Social Media & Newsletter Section (No Fake Social Posts) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Instagram & Facebook Brand Card */}
              <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 border border-pink-200/70 p-8 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <BrandLogo size="sm" />
                  <h2 className="text-2xl font-display font-bold text-slate-900">
                    Follow KID.X on Social Media
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Stay connected with our official KID.X channels for new collection drops, seasonal guides, and parent community updates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://instagram.com/kid.x_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-white border border-pink-200/80 hover:border-pink-400 flex items-center gap-3 transition-colors"
                  >
                    <Instagram className="w-6 h-6 text-pink-600 shrink-0" />
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Instagram</div>
                      <div className="text-sm font-bold text-slate-900">@kid.x_official</div>
                    </div>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-white border border-blue-200/80 hover:border-blue-400 flex items-center gap-3 transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Facebook</div>
                      <div className="text-sm font-bold text-slate-900">KID.X</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Parent Club Newsletter */}
              <div className="lg:col-span-6 rounded-3xl bg-slate-900 text-white p-8 flex flex-col justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold text-[#FFCA3A]">
                    KID.X PARENT CLUB · INDIA
                  </span>
                  <h2 className="text-2xl font-display font-bold">
                    Join the KID.X Family Newsletter
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Receive age-by-age milestone checklists (0–10 Years), early access to festive collections, and demo offer alerts.
                  </p>
                </div>

                {newsletterSubscribed ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center gap-3 text-emerald-200 text-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Welcome to the KID.X Parent Club! You are subscribed.</span>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newsletterEmail.trim()) setNewsletterSubscribed(true);
                    }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#FFCA3A]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#FF595E] hover:bg-[#e6484d] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* 10. Homepage Contact Section */}
            <ContactSection />
          </>
        )}

        {/* =========================================================
            PAGE 2: FULL 100-PRODUCT CATALOGUE & ADVANCED FILTERS
           ========================================================= */}
        {activePage === 'shop' && (
          <div className="space-y-6">
            {/* Catalogue Header */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>KID.X India Catalogue</span>
                  <span>·</span>
                  <span>Ages 0–10 Years</span>
                  <span>·</span>
                  <span>100% Unique Products</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  {selectedCategory === 'ALL' ? 'All Kids & Baby Products' : selectedCategory}
                  {selectedSubcategory !== 'ALL' ? ` — ${selectedSubcategory}` : ''}
                </h1>
              </div>

              {/* Sort & Count */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-500 tabular-nums">
                  Showing <strong>{filteredProducts.length}</strong> of <strong>{PRODUCTS.length}</strong> unique products
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort products"
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF595E]"
                >
                  <option value="popular">Sort: Popular</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="price-asc">Sort: Price Low to High (₹)</option>
                  <option value="price-desc">Sort: Price High to Low (₹)</option>
                  <option value="discount">Sort: Highest Discount</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Sidebar: Advanced Filters */}
              <aside className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-sm font-display font-bold text-slate-900">
                    <SlidersHorizontal className="w-4 h-4 text-[#FF595E]" />
                    <span>Filters</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF595E] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                </div>

                {/* Filter 1: Gender */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['ALL', 'Boys', 'Girls', 'Unisex'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setSelectedGender(g)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          selectedGender === g
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {g === 'ALL' ? 'All Genders' : g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 2: Category */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </label>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('ALL');
                        setSelectedSubcategory('ALL');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex justify-between ${
                        selectedCategory === 'ALL'
                          ? 'bg-[#FF595E] text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="tabular-nums">{PRODUCTS.length}</span>
                    </button>
                    {MAIN_CATEGORIES.map((cat) => {
                      const count = PRODUCTS.filter((p) => p.category === cat.name).length;
                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            setSelectedSubcategory('ALL');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex justify-between ${
                            selectedCategory === cat.name
                              ? 'bg-[#FF595E] text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="tabular-nums opacity-80">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter 3: Product Type / Subcategory */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Product Type
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF595E]"
                  >
                    <option value="ALL">All Product Types ({availableSubcategories.length})</option>
                    {availableSubcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter 4: Age Group (0–10 Years) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Age Group (0–10 Years)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => setSelectedAge('ALL')}
                      className={`col-span-2 py-1.5 px-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        selectedAge === 'ALL'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      All Ages (0–10 Years)
                    </button>
                    {AGE_GROUPS.map((ag) => (
                      <button
                        key={ag.label}
                        type="button"
                        onClick={() => setSelectedAge(ag.label)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap truncate ${
                          selectedAge === ag.label
                            ? 'bg-[#0D9488] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {ag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 5: Price (₹ INR) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Price Range (₹ INR)
                  </label>
                  <div className="space-y-1">
                    {[
                      { id: 'ALL' as const, label: 'All Prices' },
                      { id: 'UNDER_500' as const, label: 'Under ₹500' },
                      { id: '500_999' as const, label: '₹500 – ₹999' },
                      { id: '1000_1499' as const, label: '₹1,000 – ₹1,499' },
                      { id: '1500_PLUS' as const, label: '₹1,500 & Above' },
                    ].map((band) => (
                      <button
                        key={band.id}
                        type="button"
                        onClick={() => setSelectedPriceBand(band.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                          selectedPriceBand === band.id
                            ? 'bg-slate-900 text-white font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {band.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 6: Discount */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Discount
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[0, 20, 25, 30, 35].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedMinDiscount(d)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          selectedMinDiscount === d
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {d === 0 ? 'All' : `${d}%+ OFF`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter 7: Size / Pack */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Size / Pack
                  </label>
                  <select
                    value={selectedSizeFilter}
                    onChange={(e) => setSelectedSizeFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="ALL">All Sizes</option>
                    {availableSizes.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                </div>
              </aside>

              {/* Right Column: Product Grid */}
              <div className="lg:col-span-9 space-y-5">
                {/* Active Filter Bar */}
                {(selectedCategory !== 'ALL' ||
                  selectedSubcategory !== 'ALL' ||
                  selectedGender !== 'ALL' ||
                  selectedAge !== 'ALL' ||
                  selectedPriceBand !== 'ALL' ||
                  selectedMinDiscount > 0 ||
                  selectedSizeFilter !== 'ALL' ||
                  selectedBadgeTab !== 'ALL' ||
                  searchQuery.trim() !== '') && (
                  <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs">
                    <span className="font-semibold text-slate-500">Active Filters:</span>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-800"
                      >
                        Search: "{searchQuery}" <X className="w-3 h-3" />
                      </button>
                    )}
                    {selectedCategory !== 'ALL' && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('ALL')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-800"
                      >
                        {selectedCategory} <X className="w-3 h-3" />
                      </button>
                    )}
                    {selectedSubcategory !== 'ALL' && (
                      <button
                        type="button"
                        onClick={() => setSelectedSubcategory('ALL')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-800"
                      >
                        {selectedSubcategory} <X className="w-3 h-3" />
                      </button>
                    )}
                    {selectedGender !== 'ALL' && (
                      <button
                        type="button"
                        onClick={() => setSelectedGender('ALL')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-800"
                      >
                        {selectedGender} <X className="w-3 h-3" />
                      </button>
                    )}
                    {selectedAge !== 'ALL' && (
                      <button
                        type="button"
                        onClick={() => setSelectedAge('ALL')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-medium text-slate-800"
                      >
                        Age: {selectedAge} <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
                    <h3 className="text-lg font-display font-bold text-slate-900">
                      No matching products found
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try clearing one or more filters to browse all 100 unique KID.X products.
                    </p>
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="px-5 py-2.5 rounded-xl bg-[#FF595E] text-white text-xs font-semibold cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isWishlisted={wishlist.includes(product.id)}
                        inCartQty={getCartQty(product.id)}
                        onToggleWishlist={toggleWishlist}
                        onAddToCart={addToCart}
                        onQuickView={setQuickViewProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            PAGE 3: OFFERS & DEALS PAGE
           ========================================================= */}
        {activePage === 'offers' && (
          <OffersView
            wishlist={wishlist}
            getCartQty={getCartQty}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onQuickView={setQuickViewProduct}
          />
        )}

        {/* =========================================================
            PAGE 4: WISHLIST PAGE
           ========================================================= */}
        {activePage === 'wishlist' && (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Saved Wishlist ({wishlistedProducts.length})
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Your favorite KID.X clothing, toys, books, and baby care essentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('shop')}
                className="text-xs font-semibold text-[#FF595E] hover:underline cursor-pointer"
              >
                Continue Shopping →
              </button>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-lg font-display font-bold text-slate-800">
                  Your wishlist is empty
                </h3>
                <button
                  type="button"
                  onClick={() => setActivePage('shop')}
                  className="px-5 py-2.5 rounded-xl bg-[#FF595E] text-white text-xs font-semibold cursor-pointer"
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={true}
                    inCartQty={getCartQty(product.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            PAGE 5: CONTACT US PAGE
           ========================================================= */}
        {activePage === 'contact' && <ContactSection isFullPage />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-block bg-white px-3 py-2 rounded-xl">
                <BrandLogo size="sm" />
              </div>
              <p className="text-sm font-medium text-white">
                "Everything little ones love, all in one place."
              </p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                India’s modern kids & baby shopping store for ages 0–10 years. Shop 100% unique kids clothing, toys, gentle baby care, books, footwear, and school essentials priced in ₹ INR.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                <a
                  href="https://instagram.com/kid.x_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1.5"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>@kid.x_official</span>
                </a>
                <span>·</span>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1.5"
                >
                  <Facebook className="w-4 h-4 text-sky-400" />
                  <span>KID.X</span>
                </a>
              </div>
            </div>

            {/* Categories Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Shop Categories
              </h3>
              <ul className="space-y-2 text-xs">
                {MAIN_CATEGORIES.map((cat) => (
                  <li key={cat.name}>
                    <button
                      type="button"
                      onClick={() => jumpToCatalogWithFilter({ category: cat.name })}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shop by Age & Gender */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Age & Gender (0–10Y)
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ gender: 'Boys' })}
                    className="hover:text-white cursor-pointer"
                  >
                    Shop Boys (0–10 Years)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ gender: 'Girls' })}
                    className="hover:text-white cursor-pointer"
                  >
                    Shop Girls (0–10 Years)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ gender: 'Unisex' })}
                    className="hover:text-white cursor-pointer"
                  >
                    Shop Unisex Essentials
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ age: '0–6 Months' })}
                    className="hover:text-white cursor-pointer"
                  >
                    Newborn (0–6 Months)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ age: '1–2 Years' })}
                    className="hover:text-white cursor-pointer"
                  >
                    Toddlers (1–3 Years)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ age: '5–6 Years' })}
                    className="hover:text-white cursor-pointer"
                  >
                    Kids (4–7 Years)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => jumpToCatalogWithFilter({ age: '9–10 Years' })}
                    className="hover:text-white cursor-pointer"
                  >
                    Older Kids (8–10 Years)
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact & India Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Contact & Shipping
              </h3>
              <div className="space-y-2 text-xs text-slate-400">
                <p>
                  <strong className="text-slate-200">Demo Email:</strong>{' '}
                  <a href="mailto:kidx.demo@example.com" className="underline hover:text-white">
                    kidx.demo@example.com
                  </a>{' '}
                  (Temporary/Demo)
                </p>
                <p>
                  <strong className="text-slate-200">WhatsApp:</strong> [ADD KID.X WHATSAPP NUMBER]
                </p>
                <p>
                  <strong className="text-slate-200">Location:</strong> [ADD KID.X BUSINESS LOCATION], India
                </p>
                <p className="text-emerald-400 font-medium pt-1">
                  Delivery Across India · Free Shipping &gt; ₹999
                </p>
                <p className="text-[11px] text-slate-400">
                  Demo Payment Options: UPI · Debit/Credit Card · Cash on Delivery (₹ INR)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} KID.X India. All rights reserved. Currency: ₹ INR.</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActivePage('offers')}
                className="hover:text-white cursor-pointer"
              >
                Offers & Deals
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setActivePage('contact')}
                className="hover:text-white cursor-pointer"
              >
                Contact Us
              </button>
              {!isInstalled && (isInstallable || isIOS) && (
                <>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => (isInstallable ? install() : setShowIOSModal(true))}
                    className="text-[#FFCA3A] hover:underline cursor-pointer"
                  >
                    Install App
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onClose={() => setQuickViewProduct(null)}
        onToggleWishlist={toggleWishlist}
        onAddToCart={(prod, sz, q) => addToCart(prod, sz, q)}
      />

      {/* Cart & Demo Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onClearCart={() => setCart([])}
      />

      {/* iOS PWA Install Guide Modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <BrandLogo size="sm" />
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              Install KID.X App on iPhone / iPad
            </h3>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
              <li>Tap the <strong>Share</strong> icon in your Safari browser toolbar.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Launch <strong>KID.X</strong> in full standalone app mode!</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
