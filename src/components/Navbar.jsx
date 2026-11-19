import React, { useState } from 'react';
import {
  Sprout,
  Users,
  Store,
  Truck,
  ShieldCheck,
  TrendingUp,
  Scale,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  Layers,
  MapPin
} from 'lucide-react';
import VerificationBadge from './common/VerificationBadge.jsx';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenBenchmark,
  onResetData
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'farmer', label: 'Farmer Hub', icon: Sprout, roleRequired: 'farmer' },
    { id: 'marketplace', label: 'Buyer Marketplace', icon: Store },
    { id: 'comparison', label: 'Offer Matrix', icon: Scale },
    { id: 'transport', label: 'Transport Pooling', icon: Truck },
    { id: 'prices', label: 'Market Prices', icon: TrendingUp },
    { id: 'orders', label: 'Orders & Tracking', icon: Layers },
    ...(currentUser.role === 'admin' ? [{ id: 'admin', label: 'Admin & KYC', icon: ShieldCheck }] : [])
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('farmer')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    FarmBridge
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    TEAM 3
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden sm:block">Farmer-Buyer Coordination & Logistics Optimizer</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools & User Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Validation Benchmark Lab Launcher Button */}
            <button
              onClick={onOpenBenchmark}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 border border-amber-300 transition-colors cursor-pointer"
              title="Compare Multi-Factor Recommendation vs Simple Highest Price"
            >
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Validation Lab</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-left text-xs transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-slate-900 leading-tight flex items-center gap-1">
                    <span className="truncate max-w-[120px]">{currentUser.name}</span>
                    <VerificationBadge status={currentUser.verificationStatus} size="sm" />
                  </div>
                  <span className="text-[10px] text-slate-500 capitalize">{currentUser.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u.id);
                          setUserDropdownOpen(false);
                          if (u.role === 'farmer') setActiveTab('farmer');
                          else if (u.role === 'buyer') setActiveTab('marketplace');
                          else if (u.role === 'transporter') setActiveTab('transport');
                          else if (u.role === 'admin') setActiveTab('admin');
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer ${
                          u.id === currentUser.id ? 'bg-emerald-50/60 font-semibold' : ''
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-800">{u.name}</div>
                          <div className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                            <span>{u.role}</span>
                            {u.farmName && <span>• {u.farmName}</span>}
                            {u.buyerType && <span>• {u.buyerType}</span>}
                          </div>
                        </div>
                        <VerificationBadge status={u.verificationStatus} size="sm" />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-100 px-3">
                    <button
                      onClick={() => {
                        onResetData();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-500 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Demo Seed Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
}
