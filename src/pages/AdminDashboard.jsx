import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MenuSquare, 
  TrendingUp, 
  Settings, 
  Search, 
  Calendar, 
  ToggleRight, 
  CheckCircle2, 
  Clock, 
  BellRing,
  MoreVertical,
  Check,
  Truck
} from 'lucide-react';

const INITIAL_ORDERS = [
  { id: "#1042", customer: "Sarah Jenkins", items: "1x Signature Lasagna, 2x Garlic Bread", total: "$24.50", status: "pending", time: "2 mins ago" },
  { id: "#1041", customer: "Mike Ross", items: "2x Gourmet Burger, 2x Cola", total: "$34.00", status: "preparing", time: "12 mins ago" },
  { id: "#1040", customer: "Emma Watson", items: "1x Quinoa Salad, 1x Green Tea", total: "$16.50", status: "ready", time: "25 mins ago" },
  { id: "#1039", customer: "David Chen", items: "3x Lasagna, 1x Tiramisu", total: "$65.00", status: "delivered", time: "45 mins ago" },
  { id: "#1038", customer: "Lisa Manoban", items: "1x Veggie Pizza", total: "$18.00", status: "delivered", time: "1 hr ago" }
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [isAccepting, setIsAccepting] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState("Live Orders");

  // Handle Order Status Progression
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus, time: "Just now" }; // reset time text for demo
        }
        return order;
      })
    );
  };

  // Filter Orders based on search query
  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased text-gray-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none mt-[-2px]">M</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
              Mrs. Pal Admin
            </span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-3">Management</div>
          
          <button 
            onClick={() => setActiveMenu("Live Orders")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              activeMenu === "Live Orders" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard size={20} className={activeMenu === "Live Orders" ? "text-orange-600" : ""} />
            Live Orders
            <span className="ml-auto bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              {orders.filter(o => o.status === 'pending').length}
            </span>
          </button>
          
          <button 
            onClick={() => setActiveMenu("Menu Management")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              activeMenu === "Menu Management" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <MenuSquare size={20} />
            Menu Management
          </button>
          
          <button 
            onClick={() => setActiveMenu("Revenue Analytics")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              activeMenu === "Revenue Analytics" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <TrendingUp size={20} />
            Revenue Analytics
          </button>
          
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-8 px-3">Configuration</div>
          
          <button 
            onClick={() => setActiveMenu("Settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              activeMenu === "Settings" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings size={20} />
            Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-xl transition" onClick={() => alert("Store Manager Profile")}>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Store Manager</p>
              <p className="text-xs text-gray-500">ID: 4892</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{activeMenu}</h1>
            
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, customers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Today, Apr 4</span>
            </button>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            <button 
              onClick={() => setIsAccepting(!isAccepting)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-sm ${
                isAccepting 
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {isAccepting && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAccepting ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              Status: {isAccepting ? 'Accepting Orders' : 'Paused'}
              <ToggleRight size={20} className={isAccepting ? "text-green-600 ml-1" : "text-red-600 ml-1 transform rotate-180"} />
            </button>
            
            <button onClick={() => alert("Notifications!")} className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
              <BellRing size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <LayoutDashboard size={64} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Today's Orders</p>
                  <h3 className="text-3xl font-bold text-gray-900">42</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                 <span className="text-green-600 font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded">+12%</span>
                 <span className="text-gray-400">from yesterday</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <LayoutDashboard size={64} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Revenue Today</p>
                  <h3 className="text-3xl font-bold text-gray-900">$840<span className="text-xl text-gray-400">.50</span></h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                 <span className="text-green-600 font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded">+8.5%</span>
                 <span className="text-gray-400">vs usual average</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Clock size={64} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Avg. Prep Time</p>
                  <h3 className="text-3xl font-bold text-gray-900">18 <span className="text-xl text-gray-400 font-medium whitespace-nowrap">mins</span></h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Clock size={20} className="text-orange-600" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                 <span className="text-green-600 font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded">-2 mins</span>
                 <span className="text-gray-400">faster than target</span>
              </div>
            </div>
          </div>

          {/* Main Table Area */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Incoming Orders Flow'}
              </h2>
              <div className="flex gap-2">
                <button onClick={() => alert("Open Filters")} className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition">Filter</button>
                <button onClick={() => alert("Export Data as CSV")} className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition">Export</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4 pl-6 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium w-64">Items</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Time Elapsed</th>
                    <th className="p-4 pr-6 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No orders found matching "{searchQuery}"</td>
                    </tr>
                  ) : filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-blue-50/30 transition-colors group ${order.status === 'pending' ? 'bg-orange-50/30' : ''}`}
                    >
                      <td className="p-4 pl-6 font-semibold text-gray-900">
                        {order.id}
                        {order.status === 'pending' && <span className="ml-2 w-2 h-2 inline-block bg-orange-500 rounded-full animate-pulse"></span>}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{order.customer}</div>
                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">Via Mrs. Pal App</div>
                      </td>
                      <td className="p-4 text-gray-600 pr-8">
                        <div className="line-clamp-2 leading-relaxed">{order.items}</div>
                      </td>
                      <td className="p-4 font-semibold text-gray-800">{order.total}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                          order.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          order.status === 'preparing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'ready' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          <Clock size={12} />
                          {order.time}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className={`flex justify-end gap-2 transition-opacity ${order.status === 'delivered' ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}`}>
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                            >
                              <Check size={14} /> Accept Order
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                            >
                              <Truck size={14} /> Out for Delivery
                            </button>
                          )}
                          {order.status === 'delivered' && (
                            <span className="text-gray-400 text-xs font-medium px-3 py-1.5 flex items-center gap-1.5">
                              Completed <CheckCircle2 size={14} className="text-green-500" />
                            </span>
                          )}
                          <button onClick={() => alert("More options")} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
