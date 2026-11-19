import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import DisclaimerBanner from './components/common/DisclaimerBanner.jsx';
import BenchmarkLabModal from './components/common/BenchmarkLabModal.jsx';
import FarmerDashboard from './components/farmer/FarmerDashboard.jsx';
import OfferMatrixView from './components/farmer/OfferMatrixView.jsx';
import ProduceMarketplace from './components/buyer/ProduceMarketplace.jsx';
import TransportPoolHub from './components/transport/TransportPoolHub.jsx';
import DeliveryTracker from './components/transport/DeliveryTracker.jsx';
import MarketPriceDashboard from './components/prices/MarketPriceDashboard.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import { db } from './services/db.js';

export default function App() {
  const [users, setUsers] = useState(() => db.getUsers());
  const [activeUserId, setActiveUserId] = useState(() => db.getActiveUserId());
  const [crops, setCrops] = useState(() => db.getCrops());
  const [listings, setListings] = useState(() => db.getListings());
  const [offers, setOffers] = useState(() => db.getOffers());
  const [orders, setOrders] = useState(() => db.getOrders());
  const [pools, setPools] = useState(() => db.getTransportPools());
  const [prices, setPrices] = useState(() => db.getPriceObservations());
  
  const [activeTab, setActiveTab] = useState('farmer');
  const [benchmarkModalOpen, setBenchmarkModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const currentUser = users.find(u => u.id === activeUserId) || users[0];

  const refreshAllData = () => {
    setUsers(db.getUsers());
    setListings(db.getListings());
    setOffers(db.getOffers());
    setOrders(db.getOrders());
    setPools(db.getTransportPools());
    setPrices(db.getPriceObservations());
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSwitchUser = (newUserId) => {
    db.setActiveUserId(newUserId);
    setActiveUserId(newUserId);
    const switched = users.find(u => u.id === newUserId);
    showToast(`Switched active persona to ${switched?.name} (${switched?.role})`);
  };

  const handleResetData = () => {
    db.resetToDefault();
    refreshAllData();
    showToast('Platform reset to rich default seed dataset.');
  };

  const handleAcceptOffer = (offerId) => {
    const { order } = db.acceptOffer(offerId, currentUser.name, currentUser.role);
    refreshAllData();
    showToast(`Offer accepted! Order #${order?.orderNumber} locked & dispatched.`);
    setActiveTab('orders');
  };

  const handleRejectOffer = (offerId) => {
    db.rejectOffer(offerId, currentUser.name, currentUser.role);
    refreshAllData();
    showToast('Offer declined.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Safety, Ethics & Transparency Charter Banner */}
      <DisclaimerBanner />

      {/* 2. Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        onOpenBenchmark={() => setBenchmarkModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* 3. Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {activeTab === 'farmer' && (
          <FarmerDashboard
            currentUser={currentUser}
            listings={listings}
            offers={offers}
            orders={orders}
            pools={pools}
            onRefreshData={refreshAllData}
            onOpenBenchmark={() => setBenchmarkModalOpen(true)}
          />
        )}

        {activeTab === 'marketplace' && (
          <ProduceMarketplace
            listings={listings}
            crops={crops}
            currentUser={currentUser}
            onRefreshData={refreshAllData}
            onOpenBenchmark={() => setBenchmarkModalOpen(true)}
          />
        )}

        {activeTab === 'comparison' && (
          <OfferMatrixView
            listings={listings}
            offers={offers}
            currentUser={currentUser}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onOpenBenchmark={() => setBenchmarkModalOpen(true)}
          />
        )}

        {activeTab === 'transport' && (
          <TransportPoolHub
            pools={pools}
            currentUser={currentUser}
            listings={listings}
            onRefreshData={refreshAllData}
          />
        )}

        {activeTab === 'prices' && (
          <MarketPriceDashboard
            priceObservations={prices}
            crops={crops}
          />
        )}

        {activeTab === 'orders' && (
          <DeliveryTracker
            orders={orders}
            currentUser={currentUser}
            onRefreshData={refreshAllData}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            users={users}
            priceObservations={prices}
            crops={crops}
            onRefreshData={refreshAllData}
          />
        )}
      </main>

      {/* 5. Validation & Benchmark Modal */}
      <BenchmarkLabModal
        isOpen={benchmarkModalOpen}
        onClose={() => setBenchmarkModalOpen(false)}
      />

      {/* 6. Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">FarmBridge</span>
            <span>•</span>
            <span>TEAM 3 Capstone Architecture</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Net Return Optimization</span>
            <span>•</span>
            <span>Transport Pooling</span>
            <span>•</span>
            <span>Agmarknet Price Feeds</span>
            <span>•</span>
            <button
              onClick={() => setBenchmarkModalOpen(true)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Validation & Benchmark Lab
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
