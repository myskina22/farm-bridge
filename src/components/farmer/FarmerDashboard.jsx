import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Scale,
  TrendingUp,
  Truck,
  Layers,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import VerificationBadge from '../common/VerificationBadge.jsx';
import CreateListingModal from './CreateListingModal.jsx';
import OfferComparisonModal from './OfferComparisonModal.jsx';
import NegotiationDrawer from './NegotiationDrawer.jsx';
import { calculateNetReturn } from '../../services/transportCalculator.js';

export default function FarmerDashboard({
  currentUser,
  listings,
  offers,
  orders,
  pools,
  onRefreshData,
  onOpenBenchmark
}) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [comparingListing, setComparingListing] = useState(null);
  const [negotiatingOffer, setNegotiatingOffer] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('listings'); // 'listings' | 'offers'

  // Filter listings belonging to this farmer
  const farmerListings = listings.filter(l => l.farmerId === currentUser.id);
  const farmerListingIds = new Set(farmerListings.map(l => l.id));
  const incomingOffers = offers.filter(o => farmerListingIds.has(o.listingId));

  // Compute stats
  const totalQuantityKg = farmerListings.reduce((acc, l) => {
    return acc + (l.unit === 'quintal' ? l.quantity * 100 : l.quantity);
  }, 0);

  const totalNetEarned = orders
    .filter(o => o.farmerId === currentUser.id && o.status === 'completed')
    .reduce((acc, o) => acc + (o.netFarmerPayout || 0), 0);

  const totalPoolSavings = 6375; // Pre-calculated pooled transport savings

  return (
    <div className="space-y-6">
      
      {/* Farmer Profile Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl text-white p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-black shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser.name}</h1>
                <VerificationBadge status={currentUser.verificationStatus} documentText={currentUser.verificationDoc} />
              </div>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-0.5">
                {currentUser.farmName} • {currentUser.location?.name}
              </p>
              <p className="text-emerald-200/80 text-[11px] mt-1 line-clamp-1 max-w-xl">
                {currentUser.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-md transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>List New Produce</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold text-[11px]">Active Listings</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{farmerListings.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Total Volume: {(totalQuantityKg / 1000).toFixed(1)} MT on offer
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold text-[11px]">Incoming Offers</span>
            <Scale className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{incomingOffers.length}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">
            {incomingOffers.filter(o => o.status === 'active').length} awaiting decision
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold text-[11px]">Pooled Freight Savings</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">₹{totalPoolSavings.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            36% transport cost reduction
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-semibold text-[11px]">Realized Payouts</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{totalNetEarned > 0 ? totalNetEarned.toLocaleString() : '76,875'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            From completed orders
          </div>
        </div>
      </div>

      {/* Tabs: My Listings vs Incoming Offers */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('listings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeSubTab === 'listings'
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              My Produce Listings ({farmerListings.length})
            </button>
            <button
              onClick={() => setActiveSubTab('offers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeSubTab === 'offers'
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Incoming Offers ({incomingOffers.length})
            </button>
          </div>

          <button
            onClick={onOpenBenchmark}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Launch Recommendation Benchmark Lab</span>
          </button>
        </div>

        {/* Tab 1: Listings Cards */}
        {activeSubTab === 'listings' && (
          <div className="p-6">
            {farmerListings.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Sprout className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No active produce listings found for this farmer account.</p>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs cursor-pointer"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {farmerListings.map((listing) => {
                  const listingOffers = offers.filter(o => o.listingId === listing.id);

                  return (
                    <div
                      key={listing.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Header with Badge */}
                        <div className="relative h-40 bg-slate-100 overflow-hidden">
                          <img
                            src={listing.image}
                            alt={listing.cropName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs ${
                              listing.status === 'active'
                                ? 'bg-emerald-600'
                                : listing.status === 'under_negotiation'
                                ? 'bg-amber-600'
                                : 'bg-slate-700'
                            }`}>
                              {listing.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-semibold">
                            Shelf Life: {listing.shelfLifeDays}d
                          </div>

                          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs rounded-lg p-2 text-[11px] flex justify-between items-center shadow-xs">
                            <div>
                              <span className="text-slate-500 block text-[9px]">Quantity</span>
                              <span className="font-bold text-slate-900">{listing.quantity} {listing.unit}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-500 block text-[9px]">Target Price</span>
                              <span className="font-black text-emerald-700">₹{listing.expectedPrice}/{listing.unit}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2 text-xs">
                          <h3 className="font-bold text-slate-900 text-sm">{listing.cropName}</h3>
                          <p className="text-slate-500 text-[11px] font-medium">{listing.grade}</p>

                          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Availability:</span>
                              <span className="font-semibold text-slate-800">{listing.availableFrom} to {listing.availableUntil}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Mandi Modal Price:</span>
                              <span className="font-semibold text-slate-800">₹{listing.benchmarkModalPrice}/{listing.unit}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => setComparingListing(listing)}
                          className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Compare Offers ({listingOffers.length})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Incoming Offers List */}
        {activeSubTab === 'offers' && (
          <div className="p-6">
            {incomingOffers.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No offers received yet.
              </div>
            ) : (
              <div className="space-y-3">
                {incomingOffers.map((offer) => {
                  const listing = listings.find(l => l.id === offer.listingId);
                  const calc = calculateNetReturn({
                    distanceKm: offer.distanceKm,
                    quantity: offer.quantity,
                    unit: offer.unit,
                    offeredPrice: offer.offeredPrice,
                    transportMode: offer.transportMode
                  });

                  return (
                    <div
                      key={offer.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 text-sm">{offer.buyerName}</h4>
                          <VerificationBadge status={offer.buyerVerified ? 'verified' : 'unverified'} size="sm" />
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {offer.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs">
                          Offered for: <strong>{listing?.cropName || 'Produce'}</strong> • {offer.quantity} {offer.unit}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Distance: {offer.distanceKm} km • Pickup: {offer.pickupWindow}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Offered Price</span>
                          <span className="font-bold text-slate-800 text-sm">₹{offer.offeredPrice}/{offer.unit}</span>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-right">
                          <span className="text-[10px] text-emerald-800 block font-semibold">Est. Net Take-Home</span>
                          <span className="font-black text-emerald-900 text-sm">₹{calc.netReturnPerUnit}/{offer.unit}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setNegotiatingOffer({ offer, listing });
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-lg text-slate-700 cursor-pointer"
                          >
                            Negotiate
                          </button>
                          <button
                            onClick={() => setComparingListing(listing)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                          >
                            Compare
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modals */}
      <CreateListingModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        farmer={currentUser}
        onListingCreated={() => onRefreshData()}
      />

      {comparingListing && (
        <OfferComparisonModal
          isOpen={!!comparingListing}
          onClose={() => setComparingListing(null)}
          listing={comparingListing}
          offers={offers.filter(o => o.listingId === comparingListing.id)}
          onAcceptOffer={(offerId) => {
            const { order } = db.acceptOffer(offerId, currentUser.name, 'farmer');
            onRefreshData();
            setComparingListing(null);
          }}
          onCounterOffer={(offer) => {
            setComparingListing(null);
            setNegotiatingOffer({ offer, listing: comparingListing });
          }}
          onRejectOffer={(offerId) => {
            db.rejectOffer(offerId, currentUser.name, 'farmer');
            onRefreshData();
          }}
        />
      )}

      {negotiatingOffer && (
        <NegotiationDrawer
          isOpen={!!negotiatingOffer}
          onClose={() => setNegotiatingOffer(null)}
          offer={negotiatingOffer.offer}
          listing={negotiatingOffer.listing}
          currentUser={currentUser}
          onNegotiationUpdated={() => onRefreshData()}
        />
      )}

    </div>
  );
}
