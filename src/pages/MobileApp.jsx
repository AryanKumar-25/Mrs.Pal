import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, Search, Filter, Home, Compass, ShoppingBag, 
  User, Plus, Clock, X, ChevronRight, Settings, CreditCard, 
  LogOut, Minus, Trash2, ArrowLeft, CheckCircle2, Apple, Banknote
} from 'lucide-react';

const CATEGORIES = ["Specials", "Mains", "Desserts", "Drinks", "Vegan"];

const MENU_ITEMS = [
  {
    id: 1,
    title: "Mrs. Pal's Signature Lasagna",
    description: "Layers of fresh pasta, rich meat sauce, perfectly melted mozzarella, and our secret blend of spices.",
    price: 18.50,
    tags: ["Bestseller", "Non-Veg"],
    category: "Specials",
    image: "/images/lasagna.png"
  },
  {
    id: 2,
    title: "Truffle Gourmet Burger",
    description: "Angus beef patty, truffle mayo, caramelized onions, and aged cheddar served with crispy fries.",
    price: 15.00,
    tags: ["Must Try"],
    category: "Mains",
    image: "/images/burger.png"
  },
  {
    id: 3,
    title: "Quinoa Harvest Salad",
    description: "Fresh mixed greens, quinoa, roasted sweet potatoes, and avocado topped with a lemon vinaigrette.",
    price: 12.50,
    tags: ["Healthy", "Veg"],
    category: "Specials",
    image: "/images/salad.png"
  },
  {
    id: 4,
    title: "Classic Margherita Pizza",
    description: "San Marzano tomatoes, fresh mozzarella, basil, and a drizzle of olive oil.",
    price: 14.00,
    tags: ["Veg"],
    category: "Mains",
    image: "/images/lasagna.png"
  },
  {
    id: 5,
    title: "Vegan Buddha Bowl",
    description: "Roasted chickpeas, spinach, brown rice, tahini dressing.",
    price: 13.50,
    tags: ["Vegan"],
    category: "Vegan",
    image: "/images/salad.png"
  }
];

export default function MobileApp() {
  // Splash Screen State
  const [splashState, setSplashState] = useState('visible'); // 'visible', 'fading', 'hidden'

  const [activeCategory, setActiveCategory] = useState("Specials");
  const [activeTab, setActiveTab] = useState("Home");
  
  // Checkout & Payment State
  const [paymentMode, setPaymentMode] = useState('card');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Cart state 
  const [cartItems, setCartItems] = useState([
    { item: MENU_ITEMS[0], quantity: 1 }
  ]);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);

  // Initial Splash Screen Timer
  useEffect(() => {
    // Show splash, then fade out
    const timer = setTimeout(() => setSplashState('fading'), 2500);
    const hideTimer = setTimeout(() => setSplashState('hidden'), 3300);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, []);

  // Search History Setup
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('mrsPalSearchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      const newHistory = [searchQuery.trim(), ...searchHistory.filter(h => h !== searchQuery.trim())].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('mrsPalSearchHistory', JSON.stringify(newHistory));
      setIsSearchFocused(false);
    }
  };

  const removeHistoryItem = (e, itemToRemove) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(newHistory);
    localStorage.setItem('mrsPalSearchHistory', JSON.stringify(newHistory));
  };

  const handleHistoryClick = (item) => {
    setSearchQuery(item);
    setIsSearchFocused(false);
  };

  const handleAddToCart = (selectedItem) => {
    setCartItems(prev => {
      const existing = prev.find(c => c.item.id === selectedItem.id);
      if (existing) {
        return prev.map(c => c.item.id === selectedItem.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item: selectedItem, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id, delta) => {
    setCartItems(prev => prev.map(c => {
      if (c.item.id === id) {
        const newQ = c.quantity + delta;
        return { ...c, quantity: Math.max(0, newQ) };
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const cartTotal = cartItems.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);
  const totalCartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setCartItems([]);
      setOrderSuccess(false);
      setActiveTab('Home');
    }, 4000);
  };

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery) return matchesSearch; 
    return matchesCategory;
  });

  // ========== RENDER SECTIONS ========== //

  const renderHomeContent = () => (
    <>
      <div className="p-5 pt-8 bg-brand-background sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Welcome to Mrs. Pal! 👋</p>
            <div className="flex items-center gap-1 cursor-pointer">
              <h1 className="text-xl font-bold text-brand-text truncate max-w-[200px]">128 Pal Street, NY</h1>
              <ChevronDown size={20} className="text-brand-primary" />
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("Account")}
            className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary/20 transition"
          >
            <User size={20} className="text-brand-primary" />
          </button>
        </div>

        <div className="relative mt-2" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="What are you craving?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all font-medium text-brand-text placeholder-gray-400"
          />
          <button 
            onClick={() => alert("Filter Options")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center shadow-md hover:bg-brand-accent transition"
          >
            <Filter size={16} className="text-white" />
          </button>

          {isSearchFocused && searchHistory.length > 0 && !searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30">
               <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                 Recent Searches
               </div>
               {searchHistory.map((item, idx) => (
                 <div 
                    key={idx} 
                    onClick={() => handleHistoryClick(item)}
                    className="px-4 py-3 flex items-center justify-between hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                   <div className="flex items-center gap-3 text-gray-700">
                     <Clock size={16} className="text-gray-400" />
                     <span className="font-medium text-sm">{item}</span>
                   </div>
                   <button onClick={(e) => removeHistoryItem(e, item)} className="p-1 hover:bg-gray-200 rounded-full text-gray-400">
                     <X size={14} />
                   </button>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {!searchQuery && (
        <>
          <div className="flex overflow-x-auto hide-scrollbar px-5 gap-3 mb-6">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  activeCategory === cat 
                  ? 'bg-brand-primary text-white shadow-brand-primary/30' 
                  : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="px-5 mb-8">
            <div className="relative rounded-3xl overflow-hidden shadow-lg h-48 bg-gradient-to-r from-brand-accent to-brand-primary cursor-pointer hover:opacity-95 transition" onClick={() => setActiveCategory('Specials')}>
              <img src="/images/lasagna.png" alt="Promo" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-5">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">20% OFF TODAY</span>
                <h2 className="text-white text-2xl font-bold leading-tight drop-shadow-md">Try Mrs. Pal's<br/>Signature Lasagna</h2>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="px-5">
        <h3 className="text-xl font-bold mb-4 text-brand-text flex items-center justify-between">
          {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory}
        </h3>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 font-medium">No items found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-3xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50/50 flex gap-4 transition-transform active:scale-[0.98]">
                <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-gray-50 shadow-inner">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-1 justify-between py-1">
                  <div>
                    <div className="flex gap-1.5 mb-1.5 flex-wrap">
                      {item.tags.map(tag => (
                        <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tag === 'Bestseller' ? 'bg-orange-100 text-orange-600' :
                          tag === 'Veg' ? 'bg-green-100 text-green-600' :
                          tag === 'Vegan' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="font-bold text-gray-800 text-base leading-tight mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg text-brand-primary">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md active:scale-95 hover:bg-brand-accent transition-transform"
                    >
                      <Plus size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderCartContent = () => (
    <div className="p-5 pt-10 flex flex-col min-h-full">
      <h2 className="text-2xl font-bold text-brand-text mb-6">Your Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50 pb-20">
          <ShoppingBag size={64} className="mb-4 text-brand-primary" />
          <p className="text-lg font-medium">Your cart is hungry!</p>
          <button onClick={() => setActiveTab('Home')} className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-full font-bold">Start ordering</button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto hide-scrollbar -mx-5 px-5">
            {cartItems.map(cartItem => (
              <div key={cartItem.item.id} className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm mb-4 border border-gray-50">
                <img src={cartItem.item.image} alt={cartItem.item.title} className="w-20 h-20 rounded-2xl object-cover shadow-inner" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 leading-tight mb-1">{cartItem.item.title}</h4>
                  <span className="text-brand-primary font-bold text-sm">${cartItem.item.price.toFixed(2)}</span>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateCartQuantity(cartItem.item.id, -1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200">
                      {cartItem.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                    </button>
                    <span className="font-medium w-4 text-center">{cartItem.quantity}</span>
                    <button onClick={() => updateCartQuantity(cartItem.item.id, 1)} className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center text-white shadow active:opacity-80">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-4 mb-2 border border-gray-100">
            <div className="flex justify-between mb-2 text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm text-gray-500">
              <span>Delivery Fee</span>
              <span>$2.50</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-6 text-gray-800">
              <span>Total</span>
              <span>${(cartTotal + 2.50).toFixed(2)}</span>
            </div>
            <button 
              onClick={() => setActiveTab('Checkout')}
              className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/30 active:scale-95 transition-transform"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderBrowseContent = () => (
    <div className="p-5 pt-10">
      <h2 className="text-2xl font-bold text-brand-text mb-6">Explore Menu</h2>
      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map((cat, idx) => {
           const imagePath = MENU_ITEMS.find(m => m.category === cat)?.image || "/images/lasagna.png";
           return (
             <div 
               key={cat} 
               onClick={() => { setActiveCategory(cat); setActiveTab('Home'); }}
               className="relative overflow-hidden rounded-3xl h-40 shadow-md cursor-pointer active:scale-95 transition-transform"
             >
               <img src={imagePath} className="absolute inset-0 w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"></div>
               <span className="absolute bottom-4 left-4 text-white font-bold text-lg">{cat}</span>
             </div>
           );
        })}
      </div>
      <div className="mt-8">
         <h3 className="text-lg font-bold mb-4">All Items (A-Z)</h3>
         <div className="flex flex-col gap-3">
           {[...MENU_ITEMS].sort((a,b) => a.title.localeCompare(b.title)).map(item => (
             <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm cursor-pointer" onClick={() => handleAddToCart(item)}>
               <div className="flex items-center gap-3">
                 <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                 <span className="font-medium text-gray-800">{item.title}</span>
               </div>
               <Plus className="text-brand-primary" size={20} />
             </div>
           ))}
         </div>
      </div>
    </div>
  );

  const renderAccountContent = () => (
    <div className="p-5 pt-10">
      <h2 className="text-2xl font-bold text-brand-text mb-6">Account Profile</h2>
      
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
           <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=ffedd5&color=c14e30&size=120" />
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-800">Jane Doe</h3>
          <p className="text-gray-500 text-sm mb-2">jane.doe@example.com</p>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Gold Member</span>
        </div>
      </div>

      <div className="space-y-3">
        {[
           { icon: ShoppingBag, label: "Past Orders", details: "3 recent" },
           { icon: CreditCard, label: "Payment Methods", details: "Visa ending in 4242" },
           { icon: Home, label: "Saved Addresses", details: "2 addresses" },
           { icon: Settings, label: "App Settings" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm cursor-pointer active:scale-95 transition-transform" onClick={() => alert(`${item.label} clicked`)}>
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
                  <item.icon size={20} />
               </div>
               <div>
                 <p className="font-semibold text-gray-800">{item.label}</p>
                 {item.details && <p className="text-xs text-gray-500">{item.details}</p>}
               </div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        ))}
      </div>

      <button className="w-full mt-10 p-4 border-2 border-red-100 text-red-500 font-bold rounded-2xl flex justify-center items-center gap-2 hover:bg-red-50 transition">
        <LogOut size={20} />
        Log Out
      </button>

    </div>
  );

  const renderCheckoutContent = () => (
    <div className="p-5 pt-8 flex flex-col h-full bg-gray-50 overflow-y-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setActiveTab('Cart')} className="p-2 rounded-full bg-white shadow-sm border border-gray-100 active:scale-95 transition">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary"></div>
        <h3 className="text-gray-500 text-sm font-semibold mb-2">Delivery Address</h3>
        <p className="font-bold text-gray-800 text-lg">128 Pal Street</p>
        <p className="text-gray-500 text-sm">Apt 4B, New York, NY 10001</p>
        <button className="text-brand-primary text-sm font-bold mt-3 hover:text-brand-accent transition">Change Address</button>
      </div>

      <h3 className="font-bold text-xl text-gray-800 mb-4">Payment Method</h3>
      <div className="flex flex-col gap-3 mb-8">
        
        <label className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMode === 'card' ? 'border-brand-primary bg-orange-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
               <CreditCard size={20} />
             </div>
             <div>
               <p className="font-bold text-gray-800">Credit Card</p>
               <p className="text-xs text-gray-500">**** **** **** 4242</p>
             </div>
           </div>
           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMode === 'card' ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'}`}>
             {paymentMode === 'card' && <Check size={14} className="text-white" strokeWidth={3} />}
           </div>
           <input type="radio" value="card" checked={paymentMode === 'card'} onChange={() => setPaymentMode('card')} className="hidden" />
        </label>

        <label className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMode === 'apple' ? 'border-brand-primary bg-orange-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
               <Apple size={20} fill="currentColor" />
             </div>
             <div>
               <p className="font-bold text-gray-800">Apple Pay</p>
             </div>
           </div>
           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMode === 'apple' ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'}`}>
             {paymentMode === 'apple' && <Check size={14} className="text-white" strokeWidth={3} />}
           </div>
           <input type="radio" value="apple" checked={paymentMode === 'apple'} onChange={() => setPaymentMode('apple')} className="hidden" />
        </label>

        <label className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMode === 'cash' ? 'border-brand-primary bg-orange-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
               <Banknote size={20} />
             </div>
             <div>
               <p className="font-bold text-gray-800">Cash on Delivery</p>
             </div>
           </div>
           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMode === 'cash' ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'}`}>
             {paymentMode === 'cash' && <Check size={14} className="text-white" strokeWidth={3} />}
           </div>
           <input type="radio" value="cash" checked={paymentMode === 'cash'} onChange={() => setPaymentMode('cash')} className="hidden" />
        </label>

      </div>

      <div className="mt-auto">
        <div className="flex justify-between font-bold text-xl mb-6 text-gray-800">
           <span>Total Payment</span>
           <span>${(cartTotal + 2.50).toFixed(2)}</span>
        </div>
        <button 
          onClick={handlePlaceOrder}
          disabled={cartTotal === 0}
          className={`w-full py-4 rounded-xl font-bold shadow-lg flex justify-center items-center gap-2 transition-transform ${
            cartTotal === 0 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
            : 'bg-brand-primary text-white shadow-brand-primary/30 active:scale-95'
          }`}
        >
          Place Order
        </button>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light flex justify-center">
      <div className="w-full max-w-[400px] bg-brand-background shadow-2xl relative overflow-hidden flex flex-col h-screen">
        
        {/* Splash Screen Overlay */}
        {splashState !== 'hidden' && (
          <div className={`absolute inset-0 z-50 bg-[#c14e30] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${splashState === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-multiply" style={{ backgroundImage: "url('/images/welcoming.png')" }}></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#fdfbf7]/30 shadow-2xl mb-8 animate-float">
                <img src="/images/welcoming.png" alt="Welcome lady" className="w-full h-full object-cover" />
              </div>
              
              <h1 className="font-cursive text-7xl font-bold text-[#fdfbf7] drop-shadow-lg mb-2">
                Mrs. Pal
              </h1>
              <p className="text-orange-100 font-medium tracking-widest uppercase text-sm drop-shadow-md">
                Every Meal Feels Like Home
              </p>
            </div>
            
            <div className="absolute bottom-12 flex space-x-2">
              <div className="w-2.5 h-2.5 bg-white/60 rounded-full animate-pulse"></div>
              <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {/* Success Overlay post-checkout */}
        {orderSuccess && (
          <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-out px-6 text-center" style={{ animationDelay: '2s', animationDuration: '0.8s' }}>
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
               <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
            <p className="text-gray-500 font-medium">Mrs. Pal's kitchen is now preparing your delicious food. It will arrive shortly.</p>
          </div>
        )}

        {/* Main Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-24 relative">
          {activeTab === 'Home' && renderHomeContent()}
          {activeTab === 'Browse' && renderBrowseContent()}
          {activeTab === 'Cart' && renderCartContent()}
          {activeTab === 'Account' && renderAccountContent()}
          {activeTab === 'Checkout' && renderCheckoutContent()}
        </div>

        {/* Sticky Bottom Navigation (hide on checkout so user must use back button or finish) */}
        {activeTab !== 'Checkout' && (
          <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 pb-safe pt-3 px-6 pb-6 rounded-t-3xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-30">
            <div className="flex justify-between items-center">
              
              <button onClick={() => setActiveTab('Home')} className="flex flex-col items-center gap-1 group">
                <div className={`w-12 h-10 flex items-center justify-center rounded-2xl transition-all ${activeTab === 'Home' ? 'bg-brand-primary/10' : 'hover:bg-gray-50'}`}>
                  <Home size={22} className={activeTab === 'Home' ? "text-brand-primary" : "text-gray-400"} fill={activeTab === 'Home' ? "currentColor" : "none"} />
                </div>
                <span className={`text-[10px] font-bold ${activeTab === 'Home' ? "text-brand-primary" : "text-gray-400"}`}>Home</span>
              </button>
              
              <button onClick={() => setActiveTab('Browse')} className="flex flex-col items-center gap-1 group">
                <div className={`w-12 h-10 flex items-center justify-center rounded-2xl transition-all ${activeTab === 'Browse' ? 'bg-brand-primary/10' : 'hover:bg-gray-50'}`}>
                  <Compass size={22} className={activeTab === 'Browse' ? "text-brand-primary" : "text-gray-400"} />
                </div>
                <span className={`text-[10px] font-bold ${activeTab === 'Browse' ? "text-brand-primary" : "text-gray-400"}`}>Browse</span>
              </button>
              
              <button onClick={() => setActiveTab('Cart')} className="flex flex-col items-center gap-1 group relative">
                <div className={`w-12 h-10 flex items-center justify-center rounded-2xl transition-all ${activeTab === 'Cart' ? 'bg-brand-primary/10' : 'hover:bg-gray-50'}`}>
                  <ShoppingBag size={22} className={activeTab === 'Cart' ? "text-brand-primary" : "text-gray-400"} />
                  {totalCartCount > 0 && (
                    <span className="absolute top-0 right-1 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[9px] font-bold rounded-full border-2 border-white shadow-sm">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold ${activeTab === 'Cart' ? "text-brand-primary" : "text-gray-400"}`}>Cart</span>
              </button>
              
              <button onClick={() => setActiveTab('Account')} className="flex flex-col items-center gap-1 group">
                <div className={`w-12 h-10 flex items-center justify-center rounded-2xl transition-all ${activeTab === 'Account' ? 'bg-brand-primary/10' : 'hover:bg-gray-50'}`}>
                  <User size={22} className={activeTab === 'Account' ? "text-brand-primary" : "text-gray-400"} />
                </div>
                <span className={`text-[10px] font-bold ${activeTab === 'Account' ? "text-brand-primary" : "text-gray-400"}`}>Account</span>
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
